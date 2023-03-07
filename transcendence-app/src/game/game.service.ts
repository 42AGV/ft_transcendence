import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  calcInitialPaddleX,
  GameInfoClient,
  GameInfoServer,
  newGame,
  paddleDrag,
  paddleMoveLeft,
  paddleMoveRight,
  paddleOpponentDrag,
  paddleOpponentMoveLeft,
  paddleOpponentMoveRight,
  paddleOpponentStop,
  paddleStop,
  runGameMultiplayerFrame,
  GameMode,
} from 'pong-engine';
import { GameStatus, GameStatusUpdateDto } from 'transcendence-shared';
import { WsException } from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { GameInputDto } from './dto/game-input.dto';
import { GamePairing } from './infrastructure/db/game-pairing.entity';
import { User } from '../user/infrastructure/db/user.entity';
import { IUserRepository } from '../user/infrastructure/db/user.repository';
import { IGameRepository } from './infrastructure/db/game.repository';
import { Game } from './infrastructure/db/game.entity';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { CreateGameDto } from './dto/create-game.dto';
import { v4 as uuidv4 } from 'uuid';
import { GameMode as GameModeEnum } from './enums/game-mode.enum';
import { GameStatsService } from './stats/game-stats.service';
import { GameConfigDto } from './dto/game-config.dto';
import { isGameModeType } from './validators';
import { GameWithUsers } from './infrastructure/db/game-with-users.entity';

type GameId = string;
type UserId = string;
type ClientId = string;
type PlayerId = string;
type GameWithPlayers = {
  gameId: string;
  playerOne: User;
  playerTwo: User;
};

const FPS = 60;
const DELTA_TIME = 1 / FPS;
const MAX_PAUSED_TIME_MS = 30 * 1000; // 30 seconds
const MAX_SCORE = 10;
const RESUME_GAME_DELAY_MS = 2000;

@Injectable()
export class GameService {
  public server: Server | null = null;
  private readonly logger = new Logger(GameService.name);
  private readonly games = new Map<GameId, GameInfoServer>();
  private readonly userToGame = new Map<UserId, GameId>();
  private readonly playerToClients = new Map<UserId, Set<ClientId>>();
  private readonly playerToUser = new Map<PlayerId, User>();
  private intervalId: NodeJS.Timer | undefined = undefined;

  constructor(
    private readonly gameRepository: IGameRepository,
    private readonly userRepository: IUserRepository,
    private readonly statsService: GameStatsService,
  ) {}

  private async addGameWhenFinished(
    gameInfo: GameInfoServer,
    gameId: string,
  ): Promise<void> {
    const MAX_SMALLINT_POSTGRES = 32767;
    const duration = Math.floor((Date.now() - gameInfo.createdAt) / 1000);
    if (duration > MAX_SMALLINT_POSTGRES) {
      throw new Error(
        'Your game has been going for too long, we cannot save it',
      );
    }
    const userOne = await this.userRepository.getById(gameInfo.playerOneId);
    const userTwo = await this.userRepository.getById(gameInfo.playerTwoId);
    if (!(userTwo && userOne)) {
      throw new Error('Some of the playing users could not be found');
    }
    const game = await this.gameRepository.addGame(
      new Game({
        id: gameId,
        playerOneUsername: userOne.username,
        playerTwoUsername: userTwo.username,
        createdAt: new Date(gameInfo.createdAt),
        gameDurationInSeconds: duration,
        playerOneScore: gameInfo.gameState.score,
        playerTwoScore: gameInfo.gameState.scoreOpponent,
        gameMode: this.mapGameModeToEnum(gameInfo.gameMode),
      }),
    );
    if (!game) {
      throw new Error('Game entry could not be added');
    }
    await this.statsService.addLevelsWhenFinished(game);
  }

  private mapGameModeToEnum(gameMode: GameMode | null): GameModeEnum {
    switch (gameMode) {
      case 'classic':
        return GameModeEnum.classic;
      case 'shortPaddle':
        return GameModeEnum.shortPaddle;
      case 'mysteryZone':
        return GameModeEnum.mysteryZone;
      default:
        return GameModeEnum.unknown;
    }
  }

  private setPlayerOneMaxScore(gameId: string, gameInfo: GameInfoServer) {
    const updatedGameInfo: GameInfoServer = {
      ...gameInfo,
      gameState: { ...gameInfo.gameState, score: MAX_SCORE },
    };
    this.games.set(gameId, updatedGameInfo);
    return updatedGameInfo;
  }

  private setPlayerTwoMaxScore(gameId: string, gameInfo: GameInfoServer) {
    const updatedGameInfo: GameInfoServer = {
      ...gameInfo,
      gameState: { ...gameInfo.gameState, scoreOpponent: MAX_SCORE },
    };
    this.games.set(gameId, updatedGameInfo);
    return updatedGameInfo;
  }

  private finishGame(gameInfo: GameInfoServer, gameId: string) {
    if (!this.server) {
      return;
    }
    this.server.to(gameId).emit('gameFinished', gameInfo);
    this.server
      .to([gameInfo.playerOneId, gameInfo.playerTwoId])
      .emit('gameStatusUpdate', {
        status: GameStatus.FINISHED,
      } as GameStatusUpdateDto);
    this.server.emit('removeGame', gameId);
    this.server.emit('removePlayingUsers', {
      playerOneId: gameInfo.playerOneId,
      playerTwoId: gameInfo.playerTwoId,
    });
    this.addGameWhenFinished(gameInfo, gameId).catch((error: Error) => {
      this.logger.error(error.message);
    });
    this.games.delete(gameId);
    if (this.games.size === 0) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.server.socketsLeave(gameId);
    this.playerToClients.delete(gameInfo.playerOneId);
    this.playerToClients.delete(gameInfo.playerTwoId);
    this.userToGame.delete(gameInfo.playerOneId);
    this.userToGame.delete(gameInfo.playerTwoId);
    this.playerToUser.delete(gameInfo.playerOneId);
    this.playerToUser.delete(gameInfo.playerTwoId);
  }

  private isPausedForTooLong(gameInfo: GameInfoServer) {
    return (
      gameInfo.pausedAt !== null &&
      Date.now() >= gameInfo.pausedAt + MAX_PAUSED_TIME_MS
    );
  }

  private hasPlayerWon(gameInfo: GameInfoServer) {
    return (
      gameInfo.gameState.score >= MAX_SCORE ||
      gameInfo.gameState.scoreOpponent >= MAX_SCORE
    );
  }

  private runServerGameFrame() {
    this.games.forEach((gameInfo: GameInfoServer, gameId: GameId) => {
      if (this.server) {
        if (this.hasPlayerWon(gameInfo)) {
          this.finishGame(gameInfo, gameId);
        } else if (this.isPausedForTooLong(gameInfo)) {
          let updatedGameInfo = gameInfo;
          if (gameInfo.playerOneLeftAt && gameInfo.playerTwoLeftAt) {
            // noop, both players disconnected, keep the current score
          } else if (gameInfo.playerOneLeftAt) {
            updatedGameInfo = this.setPlayerTwoMaxScore(gameId, gameInfo);
          } else if (gameInfo.playerTwoLeftAt) {
            updatedGameInfo = this.setPlayerOneMaxScore(gameId, gameInfo);
          }
          this.finishGame(updatedGameInfo, gameId);
        } else if (gameInfo.playState === 'playing') {
          // Game is playing, update the game info
          const gameState = runGameMultiplayerFrame(
            DELTA_TIME,
            gameInfo.gameState,
          );
          const newGameInfo: GameInfoServer = { ...gameInfo, gameState };
          this.games.set(gameId, newGameInfo);
          const { playState, playerOneId, playerTwoId, gameMode } = gameInfo;
          const newGameInfoClient: GameInfoClient = {
            gameState,
            playState,
            playerOneId,
            playerTwoId,
            gameMode,
          };
          this.server.to(gameId).emit('updateGame', newGameInfoClient);
        } else {
          // Game is paused, send the current game info
          const { gameState, playState, playerOneId, playerTwoId, gameMode } =
            gameInfo;
          const gameInfoClient = {
            gameState,
            playState,
            playerOneId,
            playerTwoId,
            gameMode,
          };
          this.server.to(gameId).emit('updateGame', gameInfoClient);
        }
      }
    });
  }

  private getPlayerJoinGameInfo(
    userId: string,
    gameInfo: GameInfoServer,
  ): GameInfoServer {
    const isPlayerOne = userId === gameInfo.playerOneId;
    const isPlayerTwo = userId === gameInfo.playerTwoId;
    const playerOneLeftAt = isPlayerOne ? null : gameInfo.playerOneLeftAt;
    const playerTwoLeftAt = isPlayerTwo ? null : gameInfo.playerTwoLeftAt;
    const pausedAt =
      playerOneLeftAt === null && playerTwoLeftAt === null
        ? null
        : gameInfo.pausedAt;
    const playState = pausedAt ? 'paused' : 'playing';
    const updatedGameInfo: GameInfoServer = {
      ...gameInfo,
      playState,
      pausedAt,
      playerOneLeftAt,
      playerTwoLeftAt,
    };
    return updatedGameInfo;
  }

  private resumeGameDelay(
    clientId: string,
    userId: string,
    gameRoomId: string,
  ) {
    setTimeout(() => {
      const playerClients = this.playerToClients.get(userId);
      if (!playerClients) {
        return;
      }
      const hasClient = playerClients.has(clientId);
      const gameInfo = this.games.get(gameRoomId);
      if (!hasClient || !gameInfo) {
        return;
      }
      const updatedGameInfo = this.getPlayerJoinGameInfo(userId, gameInfo);
      this.games.set(gameRoomId, updatedGameInfo);
    }, RESUME_GAME_DELAY_MS);
  }

  handleGameJoin(client: Socket, gameRoomId: string) {
    if (!this.server) {
      return;
    }
    const game = this.games.get(gameRoomId);
    if (!game) {
      this.server.to(client.id).emit('gameNotFound');
      throw new WsException('Game not found');
    }
    client.join(gameRoomId);
    this.server.to(client.id).emit('gameJoined', {
      gameInfo: game,
      playerOne: this.playerToUser.get(game.playerOneId),
      playerTwo: this.playerToUser.get(game.playerTwoId),
    });

    const userId = client.request.user.id;
    const isPlayerOne = userId === game.playerOneId;
    const isPlayerTwo = userId === game.playerTwoId;

    if (!(isPlayerOne || isPlayerTwo)) {
      return;
    }
    const playerClients = this.playerToClients.get(userId);
    if (playerClients) {
      playerClients.add(client.id);
    } else {
      this.playerToClients.set(userId, new Set<ClientId>([client.id]));
    }

    if (!game.pausedAt) {
      return;
    }

    const gameInfo = this.getPlayerJoinGameInfo(userId, game);
    const { pausedAt } = gameInfo;
    if (pausedAt) {
      if (pausedAt === game.createdAt) {
        this.server.to(client.id).emit('gameStartPaused');
      } else {
        this.server.to(client.id).emit('gamePaused');
      }
    }
    const hasGameResumedNow = game.pausedAt !== null && pausedAt === null;
    if (hasGameResumedNow) {
      if (game.pausedAt === game.createdAt) {
        this.server.to(gameRoomId).emit('gameStartResumed');
      } else {
        this.server.to(gameRoomId).emit('gameResumed');
      }
    }
    if (hasGameResumedNow) {
      this.games.set(gameRoomId, {
        ...game,
        pausedAt: game.pausedAt + RESUME_GAME_DELAY_MS * 2,
      });
      this.resumeGameDelay(client.id, userId, gameRoomId);
    } else {
      this.games.set(gameRoomId, gameInfo);
    }
  }

  private getPlayerLeaveGameInfo(
    userId: string,
    game: GameInfoServer,
  ): GameInfoServer {
    const isPlayerOne = userId === game.playerOneId;
    const isPlayerTwo = userId === game.playerTwoId;
    const playerOneLeftAt = isPlayerOne ? Date.now() : game.playerOneLeftAt;
    const playerTwoLeftAt = isPlayerTwo ? Date.now() : game.playerTwoLeftAt;
    const pausedAt = game.pausedAt ? game.pausedAt : Date.now();
    const updatedGameInfo: GameInfoServer = {
      ...game,
      playState: 'paused',
      pausedAt,
      playerOneLeftAt,
      playerTwoLeftAt,
    };
    return updatedGameInfo;
  }

  private playerClientLeaveGame({
    userId,
    clientId,
    game,
    gameId,
  }: {
    game: GameInfoServer;
    gameId: string;
    userId: string;
    clientId: string;
  }) {
    const playerClients = this.playerToClients.get(userId);
    if (!playerClients) {
      return;
    }
    playerClients.delete(clientId);
    if (playerClients.size === 0) {
      // Pause the game when a player close all the tabs
      const updatedGameInfo = this.getPlayerLeaveGameInfo(userId, game);
      this.games.set(gameId, updatedGameInfo);
      const hasGamePausedNow = game.pausedAt === null;
      if (hasGamePausedNow) {
        if (this.server) {
          this.server.to(gameId).emit('gamePaused');
        }
      }
    }
  }

  handleGameLeave(client: Socket, gameRoomId: string) {
    const game = this.games.get(gameRoomId);
    if (!game) {
      return;
    }
    client.leave(gameRoomId);

    const userId = client.request.user.id;
    const isPlayerOne = userId === game.playerOneId;
    const isPlayerTwo = userId === game.playerTwoId;
    if (!(isPlayerOne || isPlayerTwo)) {
      return;
    }
    this.playerClientLeaveGame({
      userId,
      clientId: client.id,
      game,
      gameId: gameRoomId,
    });
  }

  handleGameCommand(client: Socket, gameInputDto: GameInputDto) {
    const { command, gameRoomId, payload } = gameInputDto;
    const gameInfo = this.games.get(gameRoomId);

    if (!gameInfo || gameInfo.playState !== 'playing') {
      return;
    }

    const userId: string = client.request.user.id;
    const isPlayerOne = userId === gameInfo.playerOneId;
    const isPlayerTwo = userId === gameInfo.playerTwoId;
    if (!isPlayerOne && !isPlayerTwo) {
      return;
    }
    if (isPlayerOne) {
      if (command === 'paddleMoveRight') {
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleMoveRight(gameInfo.gameState),
        });
      } else if (command === 'paddleMoveLeft') {
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleMoveLeft(gameInfo.gameState),
        });
      } else if (command === 'paddleDrag') {
        if (!payload) {
          return;
        }
        const { dragCurrPos, dragPrevPos } = payload;
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleDrag(gameInfo.gameState, dragCurrPos, dragPrevPos),
        });
      } else if (command === 'paddleStop') {
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleStop(gameInfo.gameState),
        });
      }
    } else {
      if (command === 'paddleMoveRight') {
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleOpponentMoveRight(gameInfo.gameState),
        });
      } else if (command === 'paddleMoveLeft') {
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleOpponentMoveLeft(gameInfo.gameState),
        });
      } else if (command === 'paddleDrag') {
        if (!payload) {
          return;
        }
        const { dragCurrPos, dragPrevPos } = payload;
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleOpponentDrag(
            gameInfo.gameState,
            dragCurrPos,
            dragPrevPos,
          ),
        });
      } else if (command === 'paddleStop') {
        this.games.set(gameRoomId, {
          ...gameInfo,
          gameState: paddleOpponentStop(gameInfo.gameState),
        });
      }
    }
  }

  gameQuitPlaying(userId: string) {
    const gameRoomId = this.userToGame.get(userId);
    if (!gameRoomId) {
      throw new WsException('User was not playing, so cannot quit');
    }
    const game = this.games.get(gameRoomId);
    if (!game) {
      throw new WsException('User was not playing, so cannot quit');
    }
    const isPlayerOne = userId === game.playerOneId;
    const isPlayerTwo = userId === game.playerTwoId;
    let updatedGameInfo = game;
    if (isPlayerOne) {
      updatedGameInfo = this.setPlayerTwoMaxScore(gameRoomId, game);
    } else if (isPlayerTwo) {
      updatedGameInfo = this.setPlayerOneMaxScore(gameRoomId, game);
    }
    this.finishGame(updatedGameInfo, gameRoomId);
  }

  getGameId(userId: string): GameId | null {
    return this.userToGame.get(userId) ?? null;
  }

  getGameInfoFromGameId(gameId: string): GameInfoServer | null {
    return this.games.get(gameId) ?? null;
  }

  getGameInfoFromUserId(userId: string): GameInfoServer | null {
    const gameId = this.getGameId(userId);
    if (!gameId) {
      return null;
    }
    return this.getGameInfoFromGameId(gameId);
  }

  isPlaying(userId: string): boolean {
    return !!this.getGameId(userId);
  }

  getOngoingGames() {
    return [...this.games.entries()].reduce<GameWithPlayers[]>(
      (ongoingGames, currentEntry) => {
        const [gameId, gameInfo] = currentEntry;
        const playerOne = this.playerToUser.get(gameInfo.playerOneId);
        const playerTwo = this.playerToUser.get(gameInfo.playerTwoId);
        if (playerOne && playerTwo) {
          return [...ongoingGames, { gameId, playerOne, playerTwo }];
        }
        return ongoingGames;
      },
      [],
    );
  }

  getPlayingUsers() {
    return this.userToGame.keys();
  }

  @OnEvent('game.ready')
  private async handleGameReady(gamePairing: Required<GamePairing>) {
    if (!gamePairing.userTwoId) {
      return;
    }
    const playerOneOngoingGameId = this.userToGame.get(gamePairing.userOneId);
    const playerTwoOngoingGameId = this.userToGame.get(gamePairing.userTwoId);
    if (playerOneOngoingGameId || playerTwoOngoingGameId) {
      // TODO: Remove this log when we can prove that this will not happen
      this.logger.log(
        `Atleast one of the players is already in a game
        playerOneId: ${gamePairing.userOneId} - gameId: ${playerOneOngoingGameId}
        playerTwoId: ${gamePairing.userTwoId} - gameId: ${playerTwoOngoingGameId}`,
      );
      return;
    }
    const playerOne = await this.userRepository.getById(gamePairing.userOneId);
    const playerTwo = await this.userRepository.getById(gamePairing.userTwoId);
    if (!playerOne || !playerTwo) {
      return;
    }
    this.playerToUser.set(playerOne.id, playerOne);
    this.playerToUser.set(playerTwo.id, playerTwo);
    this.userToGame.set(gamePairing.userOneId, gamePairing.gameRoomId);
    this.userToGame.set(gamePairing.userTwoId, gamePairing.gameRoomId);
    const gameState = newGame();
    const now = Date.now();
    this.games.set(gamePairing.gameRoomId, {
      gameState: gameState,
      playState: 'paused',
      createdAt: now,
      playerOneId: gamePairing.userOneId,
      playerTwoId: gamePairing.userTwoId,
      pausedAt: now,
      playerOneLeftAt: now,
      playerTwoLeftAt: now,
      gameMode: null,
    });
    if (!this.intervalId) {
      // buscar una mejor manera de hacer esto -> instanciar un gameRunner?
      this.intervalId = setInterval(() => {
        this.runServerGameFrame();
      }, DELTA_TIME * 1000);
    }
    if (this.server) {
      this.server
        .to([gamePairing.userOneId, gamePairing.userTwoId])
        .emit('gameStatusUpdate', {
          status: GameStatus.READY,
          gameRoomId: gamePairing.gameRoomId,
        } as GameStatusUpdateDto);
      this.server.emit('addGame', {
        gameId: gamePairing.gameRoomId,
        playerOne,
        playerTwo,
      });
      this.server.emit('addPlayingUsers', {
        playerOneId: gamePairing.userOneId,
        playerTwoId: gamePairing.userTwoId,
      });
    }
  }

  @OnEvent('socket.clientDisconnect')
  private async handleClientDisconnect({
    userId,
    clientId,
  }: {
    userId: string;
    clientId: string;
  }) {
    const gameId = this.userToGame.get(userId);
    if (!gameId) {
      return;
    }
    const game = this.games.get(gameId);
    if (!game) {
      return;
    }
    this.playerClientLeaveGame({ userId, clientId, game, gameId });
  }

  @OnEvent('socket.userConnect')
  private handleUserConnect({ userId }: { userId: string }) {
    const gameId = this.userToGame.get(userId);
    if (!gameId) {
      return;
    }
    if (this.server) {
      this.server.to(userId).emit('rejoinGame', gameId);
    }
  }

  addGame(game: CreateGameDto): Promise<Game | null> {
    return this.gameRepository.addGame({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      ...game,
    });
  }

  async deleteGame(gameId: string) {
    const deletedGame = await this.gameRepository.deleteById(gameId);
    if (!deletedGame) {
      throw new NotFoundException();
    }
  }

  retrieveGameWithId(id: string): Promise<Game | null> {
    return this.gameRepository.getById(id);
  }

  retrieveGames({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: PaginationWithSearchQueryDto): Promise<Game[] | null> {
    return this.gameRepository.getPaginatedGames({
      limit,
      offset,
      sort,
      search,
    });
  }

  async retrieveUserGames(
    username: string,
    {
      limit = MAX_ENTRIES_PER_PAGE,
      offset = 0,
      sort = BooleanString.False,
      search = '',
    }: PaginationWithSearchQueryDto,
  ): Promise<Game[] | null> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.gameRepository.getPaginatedUserGames(username, {
      limit,
      offset,
      sort,
      search,
    });
  }

  async retrieveUserGamesWithUsers(
    username: string,
    {
      limit = MAX_ENTRIES_PER_PAGE,
      offset = 0,
      sort = BooleanString.False,
      search = '',
    }: PaginationWithSearchQueryDto,
  ): Promise<GameWithUsers[] | null> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    return this.gameRepository.getPaginatedUserGamesWithUsers(username, {
      limit,
      offset,
      sort,
      search,
    });
  }

  handleGameConfig(client: Socket, gameConfigDto: GameConfigDto) {
    const userId = client.request.user.id;
    const gameInfo = this.games.get(gameConfigDto.gameRoomId);
    const gameMode = gameConfigDto.gameMode;

    if (gameInfo) {
      const isPlayerOne = userId === gameInfo.playerOneId;
      if (
        isPlayerOne &&
        gameInfo.gameMode === null &&
        isGameModeType(gameMode)
      ) {
        const isShortPaddleMode = gameMode === 'shortPaddle';
        this.games.set(gameConfigDto.gameRoomId, {
          ...gameInfo,
          gameState: {
            ...gameInfo.gameState,
            paddle: {
              ...gameInfo.gameState.paddle,
              x: calcInitialPaddleX(isShortPaddleMode),
              short: isShortPaddleMode,
            },
            paddleOpponent: {
              ...gameInfo.gameState.paddleOpponent,
              x: calcInitialPaddleX(isShortPaddleMode),
              short: isShortPaddleMode,
            },
          },
          gameMode,
        });
        if (this.server) {
          this.server
            .to(gameInfo.playerOneId)
            .emit('shouldConfigureGame', false);
        }
      }
    }
  }

  getShouldConfigureGame(userId: string): boolean {
    const gameInfo = this.getGameInfoFromUserId(userId);
    if (!gameInfo) {
      return false;
    }
    return gameInfo.playerOneId === userId && gameInfo.gameMode === null;
  }
}

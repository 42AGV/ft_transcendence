import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  GameState,
  GameStatus,
  GameStatusUpdateDto,
  newGame,
  paddleMoveLeft,
  paddleMoveRight,
  paddleOpponentMoveLeft,
  paddleOpponentMoveRight,
  paddleOpponentStop,
  paddleStop,
  runGameMultiplayerFrame,
} from 'pong-engine';
import { WsException } from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { GameInputDto } from './dto/game-input.dto';
import { GamePairing } from './infrastructure/db/game-pairing.entity';

type GameId = string;
type UserId = string;
type ClientId = string;
type PlayState = 'playing' | 'paused';
type GameInfo = {
  gameState: GameState;
  playState: PlayState;
  createdAt: number;
  playerOneId: string;
  playerTwoId: string;
  pausedAt: number | null;
  playerOneLeftAt: number | null;
  playerTwoLeftAt: number | null;
};

const FPS = 30;
const DELTA_TIME = 1 / FPS;
const MAX_PAUSED_TIME_MS = 30 * 1000; // 30 seconds

@Injectable()
export class GameService {
  public server: Server | null = null;
  private readonly logger = new Logger(GameService.name);
  private readonly games = new Map<GameId, GameInfo>();
  private readonly userToGame = new Map<UserId, GameId>();
  private readonly playerToClients = new Map<UserId, Set<ClientId>>();
  private intervalId: NodeJS.Timer | undefined = undefined;

  // constructor() {}

  private finishGame(gameInfo: GameInfo, gameId: string) {
    if (!this.server) {
      return;
    }
    this.server.to(gameId).emit('gameFinished', gameInfo);
    this.server
      .to([gameInfo.playerOneId, gameInfo.playerTwoId])
      .emit('gameStatusUpdate', {
        status: GameStatus.FINISHED,
      } as GameStatusUpdateDto);
    this.server.socketsLeave(gameId);
    this.playerToClients.delete(gameInfo.playerOneId);
    this.playerToClients.delete(gameInfo.playerTwoId);
    this.userToGame.delete(gameInfo.playerOneId);
    this.userToGame.delete(gameInfo.playerTwoId);
    this.games.delete(gameId);
    if (this.games.size === 0) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private runServerGameFrame() {
    this.games.forEach((gameInfo: GameInfo, gameId: GameId) => {
      if (this.server) {
        if (
          gameInfo.pausedAt &&
          Date.now() >= gameInfo.pausedAt + MAX_PAUSED_TIME_MS
        ) {
          this.finishGame(gameInfo, gameId);
        } else if (gameInfo.playState === 'playing') {
          // Game is playing, update the game info
          const gameState = runGameMultiplayerFrame(
            DELTA_TIME,
            gameInfo.gameState,
          );
          const newGameInfo: GameInfo = { ...gameInfo, gameState };
          this.games.set(gameId, newGameInfo);
          this.server.to(gameId).emit('updateGame', newGameInfo);
        } else {
          // Game is paused, send the current game info
          this.server.to(gameId).emit('updateGame', gameInfo);
        }
      }
    });
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
    this.server.to(client.id).emit('gameJoined', game);

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
    const playerOneLeftAt = isPlayerOne ? null : game.playerOneLeftAt;
    const playerTwoLeftAt = isPlayerTwo ? null : game.playerTwoLeftAt;
    const pausedAt =
      playerOneLeftAt === null && playerTwoLeftAt === null
        ? null
        : game.pausedAt;
    const playState = pausedAt === null ? 'playing' : 'paused';
    this.games.set(gameRoomId, {
      ...game,
      playState,
      pausedAt,
      playerOneLeftAt,
      playerTwoLeftAt,
    });
  }

  private playerClientLeaveGame({
    userId,
    clientId,
    game,
    gameId,
  }: {
    game: GameInfo;
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
      const isPlayerOne = userId === game.playerOneId;
      const isPlayerTwo = userId === game.playerTwoId;
      const playerOneLeftAt = isPlayerOne ? Date.now() : game.playerOneLeftAt;
      const playerTwoLeftAt = isPlayerTwo ? Date.now() : game.playerTwoLeftAt;
      const pausedAt = game.pausedAt ? game.pausedAt : Date.now();
      this.games.set(gameId, {
        ...game,
        playState: 'paused',
        pausedAt,
        playerOneLeftAt,
        playerTwoLeftAt,
      });
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
    const { command, gameRoomId } = gameInputDto;
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
    this.finishGame(game, gameRoomId);
  }

  getGameId(userId: string): GameId | null {
    return this.userToGame.get(userId) ?? null;
  }

  getGameInfoFromGameId(gameId: string): GameInfo | null {
    return this.games.get(gameId) ?? null;
  }

  getGameInfoFromUserId(userId: string): GameInfo | null {
    const gameId = this.getGameId(userId);
    if (!gameId) {
      return null;
    }
    return this.getGameInfoFromGameId(gameId);
  }

  isPlaying(userId: string): boolean {
    return !!this.getGameId(userId);
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
    const gameState = newGame();
    this.games.set(gamePairing.gameRoomId, {
      gameState: gameState,
      playState: 'paused',
      createdAt: Date.now(),
      playerOneId: gamePairing.userOneId,
      playerTwoId: gamePairing.userTwoId,
      pausedAt: Date.now(),
      playerOneLeftAt: Date.now(),
      playerTwoLeftAt: Date.now(),
    });
    this.userToGame.set(gamePairing.userOneId, gamePairing.gameRoomId);
    this.userToGame.set(gamePairing.userTwoId, gamePairing.gameRoomId);
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
}

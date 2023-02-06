import {
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BadRequestTransformationFilter } from '../shared/filters/bad-request-transformation.filter';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import { GameInputDto } from './dto/game-input.dto';
import {
  GameState,
  paddleMoveRight,
  paddleMoveLeft,
  paddleStop,
  runGameMultiplayerFrame,
  newGame,
  paddleOpponentMoveRight,
  paddleOpponentMoveLeft,
  paddleOpponentStop,
  GameStatus,
} from 'pong-engine';
import { OnEvent } from '@nestjs/event-emitter';
import { GamePairing } from './infrastructure/db/game-pairing.entity';

type GameId = string;
type UserId = string;
type ClientId = string;
const FPS = 30;
const DELTA_TIME = 1 / FPS;
const MAX_PAUSED_TIME_MS = 3 * 60 * 1000; // 3 minutes;

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

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameGateway {
  @WebSocketServer() server!: Server;
  games = new Map<GameId, GameInfo>();
  playerClients = new Map<UserId, Set<ClientId>>();
  intervalId: NodeJS.Timer | undefined = undefined;

  runServerGameFrame() {
    this.games.forEach((gameInfo: GameInfo, gameId: GameId) => {
      if (
        gameInfo.pausedAt &&
        gameInfo.pausedAt + MAX_PAUSED_TIME_MS >= Date.now()
      ) {
        // Game is paused for longer than MAX_PAUSED_TIME_MS
        // end the game and cleanup
        this.server.to(gameId).emit('endGame', gameInfo);
        this.server.socketsLeave(gameId);
        this.playerClients.delete(gameInfo.playerOneId);
        this.playerClients.delete(gameInfo.playerTwoId);
        this.games.delete(gameId);
        if (this.games.size === 0) {
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        }
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
        // Game is paused, send the old game info
        this.server.to(gameId).emit('updateGame', gameInfo);
      }
    });
  }

  @SubscribeMessage('joinGame')
  handleGameJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    const game = this.games.get(gameRoomId);
    if (!game) {
      return;
    }
    client.join(gameRoomId);

    const userId = client.request.user.id;
    const isPlayerOne = userId === game.playerOneId;
    const isPlayerTwo = userId === game.playerTwoId;
    if (isPlayerOne || isPlayerTwo) {
      const playerClients = this.playerClients.get(userId);
      if (!playerClients) {
        this.playerClients.set(userId, new Set<ClientId>([client.id]));
      } else {
        playerClients.add(client.id);
      }

      if (game.pausedAt) {
        const playerOneLeftAt = isPlayerOne ? null : game.playerOneLeftAt;
        const playerTwoLeftAt = isPlayerTwo ? null : game.playerTwoLeftAt;
        const pausedAt =
          playerOneLeftAt !== null && playerTwoLeftAt !== null
            ? null
            : game.pausedAt;
        const playState = pausedAt ? 'paused' : 'playing';
        this.games.set(gameRoomId, {
          ...game,
          playState,
          pausedAt,
          playerOneLeftAt,
          playerTwoLeftAt,
        });
      }
    }
  }

  @SubscribeMessage('leaveGame')
  handleGameLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    const game = this.games.get(gameRoomId);
    if (!game) {
      return;
    }
    client.leave(gameRoomId);

    const userId = client.request.user.id;
    const isPlayerOne = userId === game.playerOneId;
    const isPlayerTwo = userId === game.playerTwoId;
    if (isPlayerOne || isPlayerTwo) {
      const playerClients = this.playerClients.get(userId);
      if (playerClients) {
        playerClients.delete(client.id);
        if (playerClients.size === 0) {
          this.games.set(gameRoomId, {
            ...game,
            pausedAt: game.pausedAt ?? Date.now(),
            playerOneLeftAt: isPlayerOne ? Date.now() : game.playerOneLeftAt,
            playerTwoLeftAt: isPlayerTwo ? Date.now() : game.playerTwoLeftAt,
          });
        }
      }
    }
  }

  @SubscribeMessage('gameCommand')
  handleGameMessage(
    @MessageBody() gameInputDto: GameInputDto,
    @ConnectedSocket() client: Socket,
  ) {
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

  @OnEvent('game.ready')
  async handleGameReady(data: { status: GameStatus; game: GamePairing }) {
    if (!data.game.userTwoId) {
      return;
    }
    const gameState = newGame();
    this.games.set(data.game.gameRoomId, {
      gameState: gameState,
      playState: 'paused',
      createdAt: Date.now(),
      playerOneId: data.game.userOneId,
      playerTwoId: data.game.userTwoId,
      pausedAt: Date.now(),
      playerOneLeftAt: Date.now(),
      playerTwoLeftAt: Date.now(),
    });
    if (!this.intervalId) {
      // buscar una mejor manera de hacer esto -> instanciar un gameRunner?
      this.intervalId = setInterval(() => {
        this.runServerGameFrame();
      }, DELTA_TIME * 1000);
    }
  }
}

import {
  ClassSerializerInterceptor,
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
  runGameFrame,
  newGame,
} from 'pong-engine';
import { GameStatus } from 'transcendence-shared';
import { OnEvent } from '@nestjs/event-emitter';
import { GamePairing } from './infrastructure/db/game-pairing.entity';

type UserId = string;
const FPS = 60;
const DELTA_TIME = 1 / FPS;
@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameGateway {
  @WebSocketServer() server!: Server;
  games = new Map<UserId, GameState>();
  intervalId: NodeJS.Timer | undefined = undefined;

  runServerGameFrame() {
    this.games.forEach((gameState: GameState, userId: UserId) => {
      const state = runGameFrame(DELTA_TIME, gameState);
      this.games.set(userId, state);
    });
  }

  sendGamesUpdates() {
    this.games.forEach((gameState: GameState, userId: UserId) => {
      this.sendGameUpdate(gameState, userId);
    });
  }

  sendGameUpdate(gameState: GameState, userId: UserId) {
    this.server.to(userId).emit('updateGame', gameState, Date.now());
  }

  @SubscribeMessage('joinGame')
  handleGameJoin(@ConnectedSocket() client: Socket) {
    const userId = client.request.user.id;
    // just intended to simulate wait, to be deleted
    setTimeout(() => {
      if (!this.games.has(userId)) {
        this.games.set(userId, newGame());
        if (!this.intervalId) {
          // buscar una mejor manera de hacer esto -> instanciar un gameRunner?
          this.intervalId = setInterval(() => {
            this.runServerGameFrame();
            this.sendGamesUpdates();
          }, DELTA_TIME * 1000);
        }
      }
      this.server.to(userId).emit('joinGame', { res: 'ok' });
    }, 2000);
  }

  @SubscribeMessage('leaveGame')
  handleGameLeave(@ConnectedSocket() client: Socket) {
    const userId = client.request.user.id;
    this.games.delete(userId);
    if (this.games.size === 0) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.server.to(userId).emit('leaveGame', { res: 'ok' });
  }

  @SubscribeMessage('gameCommand')
  handleGameMessage(
    @MessageBody() gameInputDto: GameInputDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.request.user.id;
    const { command } = gameInputDto;
    const gameState = this.games.get(userId);

    if (gameState) {
      if (command === 'paddleMoveRight') {
        this.games.set(userId, paddleMoveRight(gameState));
      } else if (command === 'paddleMoveLeft') {
        this.games.set(userId, paddleMoveLeft(gameState));
      } else if (command === 'paddleStop') {
        this.games.set(userId, paddleStop(gameState));
      }
    }
  }

  @OnEvent('game.ready')
  async handleGameReady(data: { status: GameStatus; game: GamePairing }) {
    console.log(data);
  }
}

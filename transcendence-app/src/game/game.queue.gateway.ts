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
import { GameQueueService } from './game.queue.service';
import {
  gameQueueClientToServerWsEvents,
  gameQueueServerToClientWsEvents,
  GameStatus,
  GameStatusUpdateDto,
  GameUserChallengeDto,
} from 'pong-engine';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameQueueGateway {
  @WebSocketServer() server!: Server;
  constructor(
    private gameQueueService: GameQueueService,
    private eventEmitter: EventEmitter2,
  ) {}

  afterInit(server: Server) {
    this.gameQueueService.socket = server;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameQueueJoin)
  async gameQueueJoin(@ConnectedSocket() client: Socket): Promise<boolean> {
    const retval = await this.gameQueueService.gameQueueJoin(
      client,
      client.request.user.id,
    );
    if (retval) {
      const [gameRoomId, waitingClient] = retval;
      waitingClient.join(gameRoomId);
      client.join(gameRoomId);
      this.server
        .to(gameRoomId)
        .emit(gameQueueServerToClientWsEvents.gameStatusUpdate, {
          status: GameStatus.READY,
          gameRoomId,
        } as GameStatusUpdateDto);
      this.eventEmitter.emit('game.ready', {
        status: GameStatus.READY,
        gameRoomId,
      } as GameStatusUpdateDto);
      return true;
    }
    return false;
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameQuitWaiting)
  gameQuitWaiting(@ConnectedSocket() client: Socket): boolean {
    return this.gameQueueService.gameQuitWaiting(client.request.user.id);
  }

  @SubscribeMessage(gameQueueClientToServerWsEvents.gameUserChallenge)
  gameUserChallenge(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameUserChallengeDto: GameUserChallengeDto,
  ): boolean {
    return this.gameQueueService.gameUserChallenge(
      client,
      client.request.user.username,
      client.request.user.id,
      gameUserChallengeDto.to.id,
    );
  }
}

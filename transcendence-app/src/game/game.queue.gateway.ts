import {
  ClassSerializerInterceptor,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BadRequestTransformationFilter } from '../shared/filters/bad-request-transformation.filter';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import { GameQueueService } from './game.queue.service';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameQueueGateway {
  @WebSocketServer() server!: Server;
  constructor(private gameQueueService: GameQueueService) {}

  afterInit(server: Server) {
    this.gameQueueService.socket = server;
  }

  @SubscribeMessage('gameQueueJoin')
  async gameQueueJoin(@ConnectedSocket() client: Socket): Promise<void> {
    const gameRoomId = await this.gameQueueService.gameQueueJoin(
      client.request.user.id,
    );
    if (gameRoomId) client.join(gameRoomId);
  }

  @SubscribeMessage('gameQuitWaiting')
  async gameQuitWaiting(@ConnectedSocket() client: Socket) {
    const gameRoomId = this.gameQueueService.getRoomForUserId(
      client.request.user.id,
    );
    if (gameRoomId) {
      this.gameQueueService.deleteRoom(gameRoomId);
      client.leave(gameRoomId);
    }
  }
}

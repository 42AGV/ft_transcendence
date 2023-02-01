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
export class GameGateway {
  @WebSocketServer() server!: Server;
  constructor(private gameQueueService: GameQueueService) {}

  afterInit(server: Server) {
    this.gameQueueService.socket = server;
  }

  @SubscribeMessage('joinGameQueue')
  async joinGameQueue(@ConnectedSocket() client: Socket): Promise<void> {
    const chatId = await this.gameQueueService.joinGameQueue(
      client.request.user.id,
    );
    if (chatId) client.join(chatId);
  }

  @SubscribeMessage('leaveGameRoom')
  async handleLeaveGameRoom(@ConnectedSocket() client: Socket) {
    const gameRoom = this.gameQueueService.getRoomForUserId(
      client.request.user.id,
    );
    if (gameRoom) {
      this.gameQueueService.deleteRoom(gameRoom);
      client.leave(gameRoom);
    }
  }
}

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
  // WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BadRequestTransformationFilter } from '../shared/filters/bad-request-transformation.filter';
import { WsTwoFactorAuthenticatedGuard } from '../shared/guards/ws-two-factor-authenticated.guard';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsTwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameGateway {
  @WebSocketServer() server!: Server;

  @SubscribeMessage('gameMessage')
  async handleChatMessage(
    @MessageBody('gameId', ParseUUIDPipe) gameId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(client, gameId);
  }
}

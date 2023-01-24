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
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BadRequestTransformationFilter } from '../shared/filters/bad-request-transformation.filter';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import { GameInputDto } from './dto/game-input.dto';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameGateway {
  @WebSocketServer() server!: Server;

  @SubscribeMessage('gameServerMessage')
  async handleChatMessage(
    @MessageBody() gameInputDto: GameInputDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id, command } = gameInputDto;

    const sender = client.request.user;

    const state = { id, command };

    if (state) {
      this.server.to(sender.id).emit('gameServerMessage', { ...state });
    } else {
      throw new WsException(
        'The message could not be sent. Service Unavailable',
      );
    }
  }
}

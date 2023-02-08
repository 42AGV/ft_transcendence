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
import { GameService } from './game.service';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class GameGateway {
  @WebSocketServer() server!: Server;

  constructor(private gameService: GameService) {}

  afterInit(server: Server) {
    this.gameService.server = server;
  }

  @SubscribeMessage('joinGame')
  handleGameJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    this.gameService.handleGameJoin(client, gameRoomId);
  }

  @SubscribeMessage('leaveGame')
  handleGameLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody('gameRoomId', ParseUUIDPipe) gameRoomId: string,
  ) {
    this.gameService.handleGameLeave(client, gameRoomId);
  }

  @SubscribeMessage('gameCommand')
  handleGameCommand(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameInputDto: GameInputDto,
  ) {
    this.gameService.handleGameCommand(client, gameInputDto);
  }

  @SubscribeMessage('gameQuitPlaying')
  gameQuitPlaying(@ConnectedSocket() client: Socket) {
    this.gameService.gameQuitPlaying(client.request.user.id);
  }
}

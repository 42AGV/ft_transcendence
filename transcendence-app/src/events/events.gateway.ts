import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsAuthenticatedGuard } from '../shared/guards/ws-authenticated.guard';
import { EventsService } from './events.service';

type UserId = string;
type SocketId = string;

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  connectedUsers = new Set<UserId>();

  constructor(private eventsService: EventsService) {}

  afterInit(server: Server) {
    this.eventsService.socket = server;
  }

  async handleConnection(client: Socket) {
    const user = client.request.user;
    if (!user) {
      client.disconnect();
    } else {
      this.connectedUsers.add(user.id);
      const sessionId = client.request.session.id;
      // Join the session ID room to keep track of all the clients linked to this session ID
      client.join(sessionId);
      // Join the user ID room to keep track of all the connected clients
      // (one user could connect from multiple private tabs or browsers with different session IDs)
      client.join(user.id);
      const matchingSockets: Set<SocketId> = await this.server
        .in(user.id)
        .allSockets();
      const isConnectedOnce = matchingSockets.size === 1;
      if (isConnectedOnce) {
        this.server.emit('userConnected', user);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.request.user;
    if (user) {
      const matchingSockets: Set<SocketId> = await this.server
        .in(user.id)
        .allSockets();
      const isDisconnectedAll = matchingSockets.size === 0;
      if (isDisconnectedAll) {
        this.connectedUsers.delete(user.id);
        this.server.emit('userDisconnected', user);
      }
    }
  }

  @SubscribeMessage('getConnectedUsers')
  handleGetConnectedUsers(@ConnectedSocket() client: Socket) {
    client.emit('users', [...this.connectedUsers]);
  }
}

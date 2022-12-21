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
import { Socket, Server, RemoteSocket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { WsAuthenticatedGuard } from '../shared/guards/ws-authenticated.guard';
import { SocketService } from './socket.service';

type UserId = string;

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  onlineUserIds = new Set<UserId>();

  constructor(private socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  async handleConnection(client: Socket) {
    const user = client.request.user;
    if (!user) {
      client.disconnect();
    } else {
      this.onlineUserIds.add(user.id);
      const sessionId = client.request.session.id;
      // Join the session ID room to keep track of all the clients linked to this session ID
      client.join(sessionId);
      // Join the user ID room to keep track of all the connected clients
      // (one user could connect from multiple private tabs or browsers with different session IDs)
      client.join(user.id);
      const matchingSockets: RemoteSocket<DefaultEventsMap, any>[] =
        await this.server.in(user.id).fetchSockets();
      const isConnectedOnce = matchingSockets.length === 1;
      if (isConnectedOnce) {
        this.server.emit('userConnect', user.id);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.request.user;
    if (user) {
      const matchingSockets: RemoteSocket<DefaultEventsMap, any>[] =
        await this.server.in(user.id).fetchSockets();
      const isDisconnectedAll = matchingSockets.length === 0;
      if (isDisconnectedAll) {
        this.onlineUserIds.delete(user.id);
        this.server.emit('userDisconnect', user.id);
      }
    }
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetConnectedUsers(@ConnectedSocket() client: Socket) {
    client.emit('onlineUsers', [...this.onlineUserIds]);
  }

  @SubscribeMessage('getFriends')
  handleGetFriends(@ConnectedSocket() client: Socket) {
    this.socketService.getFriends(client);
  }
}

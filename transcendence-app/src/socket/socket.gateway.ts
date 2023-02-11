import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server, RemoteSocket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import { SocketService } from './socket.service';
import { AuthorizationService } from '../authorization/authorization.service';
import { UserToRoleDto } from '../authorization/dto/user-to-role.dto';
import { UserToRole } from '../authorization/infrastructure/db/user-to-role.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  constructor(
    private socketService: SocketService,
    private authorizationService: AuthorizationService,
    private eventEmitter: EventEmitter2,
  ) {}

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  async handleConnection(client: Socket) {
    const user = client.request.user;
    if (!user) {
      client.disconnect();
    } else {
      this.socketService.addToOnlineUsers(user.id);
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
      this.eventEmitter.emit('socket.clientDisconnect', {
        userId: user.id,
        clientId: client.id,
      });
      const matchingSockets: RemoteSocket<DefaultEventsMap, any>[] =
        await this.server.in(user.id).fetchSockets();
      const isDisconnectedAll = matchingSockets.length === 0;
      if (isDisconnectedAll) {
        this.socketService.deleteFromOnlineUsers(user.id);
        this.server.emit('userDisconnect', user.id);
        this.eventEmitter.emit('socket.userDisconnect', { id: user.id });
      }
    }
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetConnectedUsers(@ConnectedSocket() client: Socket) {
    client.emit('onlineUsers', [...this.socketService.getOnlineUsers()]);
  }

  @SubscribeMessage('getFriends')
  handleGetFriends(@ConnectedSocket() client: Socket) {
    this.socketService.getFriends(client);
  }

  @SubscribeMessage('toggleUserWithRoles')
  async toggleUserWithRoles(
    @MessageBody()
    userToRoleDto: UserToRoleDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const foundUserToRole: UserToRole | null =
      await this.authorizationService.maybeGetUserToRole(userToRoleDto);
    if (foundUserToRole) {
      await this.socketService.deleteUserWithRoles(userToRoleDto, client);
    } else {
      await this.socketService.addUserWithRoles(userToRoleDto, client);
    }
  }
}

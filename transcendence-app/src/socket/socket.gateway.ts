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
import { v4 as uuidv4 } from 'uuid';

type UserId = string;
type GameId = string;

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  onlineUserIds = new Set<UserId>();
  waitingGameRoom: GameId | null = null;
  waitingGameRooms = new Map<UserId, GameId>();
  constructor(
    private socketService: SocketService,
    private authorizationService: AuthorizationService,
  ) {}

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

  @SubscribeMessage('joinGameQueue')
  async joinGameQueue(@ConnectedSocket() client: Socket): Promise<void> {
    const user = client.request.user;
    if (!this.waitingGameRoom) {
      this.waitingGameRoom = uuidv4();
      this.waitingGameRooms.set(user.id, this.waitingGameRoom);
      client.join(this.waitingGameRoom);
      this.server.emit('waitingForGame', {
        gameRoomId: this.waitingGameRoom,
      });
    } else {
      const gameRoomId = this.waitingGameRoom;
      this.waitingGameRooms.set(user.id, gameRoomId);
      client.join(gameRoomId);
      this.waitingGameRoom = null;
      this.server.emit('gameReady', {
        accepted: true,
        gameRoomId,
      });
    }
  }

  @SubscribeMessage('leaveGameRoom')
  async handleLeaveGameRoom(@ConnectedSocket() client: Socket) {
    const user = client.request.user;
    const gameRoom = this.waitingGameRooms.get(user.id);
    if (gameRoom) {
      client.leave(gameRoom);
      this.waitingGameRooms.delete(gameRoom);
    }
  }
}

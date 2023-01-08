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
  WsException,
} from '@nestjs/websockets';
import { Socket, Server, RemoteSocket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { WsAuthenticatedGuard } from '../shared/guards/ws-authenticated.guard';
import { SocketService } from './socket.service';
import { AuthorizationService } from '../authorization/authorization.service';
import { User } from '../user/infrastructure/db/user.entity';
import { UserWithAuthorizationResponseDto } from '../authorization/dto/user-with-authorization.response.dto';
import { UserToRoleDto } from '../authorization/dto/user-to-role.dto';
import { CaslAbilityFactory } from '../authorization/casl-ability.factory';
import { UserToRole } from '../authorization/infrastructure/db/user-to-role.entity';

type UserId = string;

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  onlineUserIds = new Set<UserId>();
  constructor(
    private socketService: SocketService,
    private authorizationService: AuthorizationService,
    private caslAbilityFactory: CaslAbilityFactory,
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

  @SubscribeMessage('getAuthUserWithRoles')
  async retrieveAuthUserWithRoles(
    @ConnectedSocket() client: Socket,
  ): Promise<UserWithAuthorizationResponseDto> {
    const user = client.request.user;
    if (user instanceof User) {
      try {
        const authUserUsername = user.username;
        const authUser =
          await this.authorizationService.getUserWithAuthorizationFromId(
            user.id,
          );
        return this.authorizationService.getUserWithAuthorizationResponseDtoFromUsername(
          authUserUsername,
          authUser,
        );
      } catch (e) {
        if (e instanceof Error) {
          throw new WsException(e.message);
        }
      }
    }
    throw new WsException('Bad request');
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

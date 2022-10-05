import {
  ClassSerializerInterceptor,
  Logger,
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
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { WsAuthenticatedGuard } from '../shared/guards/ws-authenticated.guard';
import { User } from '../user/user.domain';
import { ChatService } from './chat.service';

type Message = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
};

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  logger = new Logger(ChatGateway.name);
  messages = new Set<Message>();
  // Set of user IDs of the connected users
  connectedUsers = new Set<string>();

  constructor(private chatService: ChatService) {}

  afterInit(server: Server) {
    this.chatService.socket = server;
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
      client.join(user.id);
      const matchingSockets = await this.server.in(user.id).allSockets();
      const isConnectedOnce = matchingSockets.size === 1;
      if (isConnectedOnce) {
        this.server.emit('userConnected', user);
      }
      this.logger.log(
        `user ${user.username} with sessionID ${sessionId} and socketID ${
          client.id
        } connected ${isConnectedOnce ? '' : 'from a new tab or window'}`,
      );
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.request.user;
    if (user) {
      const matchingSockets = await this.server.in(user.id).allSockets();
      const isDisconnectedAll = matchingSockets.size === 0;
      if (isDisconnectedAll) {
        this.connectedUsers.delete(user.id);
        this.server.emit('userDisconnected', user);
      }
      const sessionId = client.request.session.id;
      this.logger.log(
        `user ${user.username} with sessionID ${sessionId} and socketID ${
          client.id
        } disconnected ${isDisconnectedAll ? '' : 'from a tab or window'}`,
      );
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.request.user;
    if (user) {
      const message: Message = {
        id: uuidv4(),
        user: user,
        content: data,
        createdAt: Date.now(),
      };
      this.messages.add(message);
      this.sendMessage(message);
    }
  }

  sendMessage(message: Message) {
    this.server.emit('message', message);
  }

  @SubscribeMessage('getMessages')
  handleGetMessages() {
    this.server.emit('messages', [...this.messages]);
  }

  @SubscribeMessage('getConnectedUsers')
  handleGetConnectedUsers() {
    this.server.emit('users', [...this.connectedUsers]);
  }
}

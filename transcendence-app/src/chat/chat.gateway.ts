import { Logger, UseGuards } from '@nestjs/common';
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
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  logger = new Logger(ChatGateway.name);
  messages = new Set<Message>();
  connectedUsers = new Map<string, User>();

  constructor(private chatService: ChatService) {}

  afterInit(server: Server) {
    this.chatService.socket = server;
  }

  async handleConnection(client: Socket) {
    const user = await client.request.user;
    if (!user) {
      client.disconnect();
    } else {
      this.connectedUsers.set(user.id, user);
      const sessionId = client.request.session.id;
      client.join(sessionId);
      this.logger.log(
        `user ${user.username} with sessionID ${sessionId} and socketID ${client.id} connected`,
      );
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await client.request.user;
    if (user) {
      this.connectedUsers.delete(user.id);
      const sessionId = client.request.session.id;
      this.logger.log(
        `user ${user.username} with sessionID ${sessionId} and socketID ${client.id} disconnected`,
      );
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await client.request.user;
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
    // client.broadcast.emit('message', message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('getMessages')
  handleGetMessages() {
    this.server.emit('messages', [...this.messages]);
  }
}

import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { WsAuthenticatedGuard } from '../shared/guards/ws-authenticated.guard';
import { User } from '../user/user.domain';

type Message = {
  id: string;
  username: string;
  value: string;
  time: number;
};

@WebSocketGateway()
@UseGuards(WsAuthenticatedGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  logger = new Logger(ChatGateway.name);
  messages = new Set<Message>();
  connectedUsers = new Map<string, User>();

  async handleConnection(client: Socket) {
    const user = await client.request.user;
    if (!user) {
      client.disconnect();
    } else {
      this.connectedUsers.set(user.id, user);
      this.logger.log(`user ${user.username} connected`);
    }
  }

  async handleDisconnect(client: Socket) {
    const user = await client.request.user;
    if (user) {
      this.connectedUsers.delete(user.id);
      this.logger.log(`user ${user.username} disconnected`);
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
        username: user.username,
        value: data,
        time: Date.now(),
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
    return this.messages;
  }
}

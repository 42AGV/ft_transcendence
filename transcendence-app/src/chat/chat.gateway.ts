import { Logger /*, UseGuards */ } from '@nestjs/common';
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
// TODO: Implement WebSocket authentication guard WsAuthenticatedGuard
// import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';

type UserType = {
  id: string;
  name: string;
};

type MessageType = {
  id: string;
  user: UserType;
  value: string;
  time: number;
};

const defaultUser = {
  id: 'anon',
  name: 'Anonymous',
};

@WebSocketGateway()
// @UseGuards(AuthenticatedGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  logger = new Logger(ChatGateway.name);
  messages = new Set<MessageType>();
  users = new Map<Socket, UserType>();

  handleConnection(socket: Socket) {
    this.logger.log(`client ${socket.id} connected`);
    this.users.set(socket, { id: socket.id, name: socket.id });
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`client ${socket.id} disconnected`);
    this.users.delete(socket);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const message: MessageType = {
      id: uuidv4(),
      user: this.users.get(client) || defaultUser,
      value: data,
      time: Date.now(),
    };
    this.messages.add(message);
    this.sendMessage(message);
  }

  sendMessage(message: MessageType) {
    // client.broadcast.emit('message', message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('getMessages')
  handleGetMessages() {
    return this.messages;
  }
}

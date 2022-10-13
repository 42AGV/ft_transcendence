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
  roomId: string;
};

type UserId = string;
type RoomId = string;
type SocketId = string;

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  logger = new Logger(ChatGateway.name);
  connectedUsers = new Set<UserId>();
  rooms = new Map<RoomId, Set<Message>>();

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

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { roomId: RoomId; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.request.user;
    const { roomId, content } = data;
    const room = this.rooms.get(roomId);
    if (user && room) {
      const message: Message = {
        id: uuidv4(),
        user: user,
        content: content,
        createdAt: Date.now(),
        roomId: roomId,
      };
      room.add(message);
      this.server.to(roomId).emit('message', message);
    }
  }

  @SubscribeMessage('getMessages')
  handleGetMessages(
    @MessageBody() roomId: RoomId,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = this.rooms.get(roomId);
    if (messages) {
      client.emit('messages', [...messages]);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: RoomId,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set<Message>());
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: RoomId,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
  }

  @SubscribeMessage('getConnectedUsers')
  handleGetConnectedUsers(@ConnectedSocket() client: Socket) {
    client.emit('users', [...this.connectedUsers]);
  }
}

import {
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { WsAuthenticatedGuard } from '../shared/guards/ws-authenticated.guard';
import { User } from '../user/user.domain';

type ChatroomMessage = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
  chatroomId: string;
};

type ChatroomId = string;

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatGateway {
  @WebSocketServer() server!: Server;
  chatrooms = new Map<ChatroomId, Set<ChatroomMessage>>();

  @SubscribeMessage('chatroomMessage')
  handleMessage(
    @MessageBody() data: { chatroomId: ChatroomId; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.request.user;
    const { chatroomId, content } = data;
    const chatroom = this.chatrooms.get(chatroomId);
    if (user && chatroom) {
      const message: ChatroomMessage = {
        id: uuidv4(),
        user: user,
        content: content,
        createdAt: Date.now(),
        chatroomId: chatroomId,
      };
      chatroom.add(message);
      this.server.to(chatroomId).emit('chatroomMessage', message);
    }
  }

  @SubscribeMessage('getChatroomMessages')
  handleGetMessages(
    @MessageBody() chatroomId: ChatroomId,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = this.chatrooms.get(chatroomId);
    if (messages) {
      client.emit('chatroomMessages', [...messages]);
    }
  }

  @SubscribeMessage('joinChatroom')
  handleJoinRoom(
    @MessageBody() chatroomId: ChatroomId,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatroomId);
    if (!this.chatrooms.has(chatroomId)) {
      this.chatrooms.set(chatroomId, new Set<ChatroomMessage>());
    }
  }

  @SubscribeMessage('leaveChatroom')
  handleLeaveRoom(
    @MessageBody() chatroomId: ChatroomId,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(chatroomId);
  }
}

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

type ChatRoomMessage = {
  id: string;
  user: User;
  content: string;
  createdAt: number;
  chatRoomId: string;
};

type ChatRoomId = string;

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatGateway {
  @WebSocketServer() server!: Server;
  chatRooms = new Map<ChatRoomId, Set<ChatRoomMessage>>();

  @SubscribeMessage('chatRoomMessage')
  handleMessage(
    @MessageBody() data: { chatRoomId: ChatRoomId; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.request.user;
    const { chatRoomId, content } = data;
    const chatRoom = this.chatRooms.get(chatRoomId);
    if (user && chatRoom) {
      const message: ChatRoomMessage = {
        id: uuidv4(),
        user: user,
        content: content,
        createdAt: Date.now(),
        chatRoomId: chatRoomId,
      };
      chatRoom.add(message);
      this.server.to(chatRoomId).emit('chatRoomMessage', message);
    }
  }

  @SubscribeMessage('getChatRoomMessages')
  handleGetMessages(
    @MessageBody() chatRoomId: ChatRoomId,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = this.chatRooms.get(chatRoomId);
    if (messages) {
      client.emit('chatRoomMessages', [...messages]);
    }
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinRoom(
    @MessageBody() chatRoomId: ChatRoomId,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatRoomId);
    if (!this.chatRooms.has(chatRoomId)) {
      this.chatRooms.set(chatRoomId, new Set<ChatRoomMessage>());
    }
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveRoom(
    @MessageBody() chatRoomId: ChatRoomId,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(chatRoomId);
  }
}

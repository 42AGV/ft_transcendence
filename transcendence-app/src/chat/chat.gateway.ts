import {
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BadRequestTransformationFilter } from '../shared/filters/bad-request-transformation.filter';
import { WsAuthenticatedGuard } from '../shared/guards/ws-authenticated.guard';
import { ChatService } from './chat.service';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import { CreateChatroomMessageDto } from './chatroom/chatroom-message/dto/create-chatroom-message.dto';
import { CreateChatMessageDto } from './chat/dto/create-chat-message.dto';
import { UserService } from '../user/user.service';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class ChatGateway {
  @WebSocketServer() server!: Server;

  constructor(
    private chatService: ChatService,
    private chatroomMemberService: ChatroomMemberService,
    private userService: UserService,
  ) {}

  @SubscribeMessage('chatMessage')
  async handleChatMessage(
    @MessageBody()
    createChatMessageDto: CreateChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { userId: recipientId, content } = createChatMessageDto;

    const senderId = client.request.user.id;

    const block = await this.userService.getBlockRelation(
      recipientId,
      senderId,
    );

    if (block?.isUserBlockedByMe || block?.amIBlockedByUser) {
      throw new WsException('There is an existing blockage. Forbidden.');
    }

    const message = await this.chatService.saveOneToOneChatMessage({
      senderId,
      recipientId,
      content,
    });

    if (message) {
      this.server.to(recipientId).emit('chatMessage', { ...message });
    } else {
      throw new WsException(
        'The message could not be sent. Service Unavailable',
      );
    }
  }

  @SubscribeMessage('chatroomMessage')
  async handleChatroomMessage(
    @MessageBody()
    createChatroomMessageDto: CreateChatroomMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatroomId, content } = createChatroomMessageDto;
    const user = client.request.user;
    const chatroomMember = await this.chatroomMemberService.getById(
      chatroomId,
      user.id,
    );
    if (!chatroomMember || chatroomMember.banned) {
      throw new WsException('Not a chatroom member. Forbidden.');
    }
    if (chatroomMember.muted) {
      throw new WsException(
        "Account muted. You can't reply in this chatroom. Forbidden.",
      );
    }
    const message = await this.chatService.addChatroomMessage({
      chatroomId,
      userId: user.id,
      content,
    });
    if (message) {
      this.server.to(chatroomId).emit('chatroomMessage', { ...message, user });
    } else {
      throw new WsException(
        'The message could not be sent. Service Unavailable',
      );
    }
  }

  @SubscribeMessage('joinChatroom')
  async handleJoinRoom(
    @MessageBody('chatroomId', ParseUUIDPipe) chatroomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const chatroomMember = await this.chatroomMemberService.getById(
      chatroomId,
      client.request.user.id,
    );
    if (!chatroomMember || chatroomMember.banned) {
      throw new WsException('Not a chatroom member. Forbidden.');
    }
    client.join(chatroomId);
  }

  @SubscribeMessage('leaveChatroom')
  async handleLeaveRoom(
    @MessageBody('chatroomId', ParseUUIDPipe) chatroomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(chatroomId);
  }
}

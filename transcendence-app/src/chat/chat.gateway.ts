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

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(WsAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class ChatGateway {
  @WebSocketServer() server!: Server;

  constructor(
    private chatService: ChatService,
    private chatroomMemberService: ChatroomMemberService,
  ) {}

  @SubscribeMessage('chatroomMessage')
  async handleMessage(
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
    if (!chatroomMember || chatroomMember.muted) {
      throw new WsException('Forbidden');
    }
    const message = await this.chatService.addChatroomMessage({
      chatroomId,
      userId: user.id,
      content,
    });
    if (message) {
      this.server.to(chatroomId).emit('chatroomMessage', { ...message, user });
    } else {
      throw new WsException('Service Unavailable');
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
    if (!chatroomMember) {
      throw new WsException('Forbidden');
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

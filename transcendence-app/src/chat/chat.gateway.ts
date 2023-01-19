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
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import { ChatService } from './chat.service';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import { CreateChatroomMessageDto } from './chatroom/chatroom-message/dto/create-chatroom-message.dto';
import { CreateChatMessageDto } from './chat/dto/create-chat-message.dto';
import { UserService } from '../user/user.service';
import { ChatMessageWithUser } from './chat/infrastructure/db/chat-message-with-user.entity';
import { CaslAbilityFactory } from '../authorization/casl-ability.factory';
import { AuthorizationService } from '../authorization/authorization.service';
import { Action } from '../shared/enums/action.enum';
import { instanceToPlain } from 'class-transformer';

@WebSocketGateway({ path: '/api/v1/socket.io' })
@UseGuards(TwoFactorAuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(BadRequestTransformationFilter)
export class ChatGateway {
  @WebSocketServer() server!: Server;

  constructor(
    private chatService: ChatService,
    private chatroomMemberService: ChatroomMemberService,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly authorizationService: AuthorizationService,
    private userService: UserService,
  ) {}

  @SubscribeMessage('chatMessage')
  async handleChatMessage(
    @MessageBody()
    createChatMessageDto: CreateChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { id: recipientId, content } = createChatMessageDto;

    const sender = client.request.user;

    const block = await this.userService.getBlockRelation(
      recipientId,
      sender.id,
    );

    if (block?.isUserBlockedByMe || block?.amIBlockedByUser) {
      throw new WsException('There is an existing blockage. Forbidden.');
    }

    const message = await this.chatService.saveOneToOneChatMessage({
      senderId: sender.id,
      recipientId,
      content,
    });

    const messageWithUser = Object.assign(ChatMessageWithUser, {
      ...message,
      userId: sender.id,
      username: sender.username,
      avatarId: sender.avatarId,
      avatarX: sender.avatarX,
      avatarY: sender.avatarY,
    });

    if (message) {
      this.server.to(recipientId).emit('chatMessage', { ...messageWithUser });
      this.server.to(sender.id).emit('chatMessage', { ...messageWithUser });
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
    const { id: chatroomId, content } = createChatroomMessageDto;
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
      this.server
        .to(chatroomId)
        .emit('chatroomMessage', { ...message, user: instanceToPlain(user) });
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
    const cr = await this.chatService.getChatroomById(chatroomId);
    if (!cr) {
      throw new WsException('Chatroom not found');
    }
    const crm = await this.authorizationService.getUserAuthContextForChatroom(
      client.request.user.id,
      chatroomId,
    );
    if (!crm) {
      throw new WsException('No such user id or chatroom id');
    }
    const ability = this.caslAbilityFactory.defineAbilitiesFor(crm);
    if (ability.cannot(Action.Join, cr)) {
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

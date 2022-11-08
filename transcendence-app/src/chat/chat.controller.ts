import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Chatroom } from './chatroom/infrastructure/db/chatroom.entity';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatroomDto } from './chatroom/dto/create-chatroom.dto';
import { User } from '../user/infrastructure/db/user.entity';
import { User as GetUser } from '../user/decorators/user.decorator';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import {
  ChatroomMember,
  ChatroomMemberWithUser,
} from './chatroom/chatroom-member/infrastructure/db/chatroom-member.entity';
import { PaginationQueryDto } from '../shared/dtos/pagination.query.dto';
import { ChatroomMessageWithUser } from './chatroom/chatroom-message/infrastructure/db/chatroom-message-with-user.entity';
import { ChatMessage } from './chat/infrastructure/db/chat-message.entity';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { UpdateChatroomDto } from './chatroom/dto/update-chatroom.dto';
import { JoinChatroomDto } from './chatroom/dto/join-chatroom.dto';

@Controller('chat')
@UseGuards(AuthenticatedGuard)
@ApiTags('chat')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatroomMemberService: ChatroomMemberService,
  ) {}

  @Post('room')
  @ApiCreatedResponse({ description: 'Create a chatroom', type: Chatroom })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async createChatroom(
    @GetUser() user: User,
    @Body() createChatDto: CreateChatroomDto,
  ) {
    const chatroom = await this.chatService.createChatroom(
      user.id,
      createChatDto,
    );

    if (!chatroom) {
      throw new UnprocessableEntityException();
    }
    return chatroom;
  }

  @Post('room/:chatroomId/members')
  @ApiCreatedResponse({
    description: 'Add a member to a chatroom',
    type: ChatroomMember,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async createChatroomMember(
    @GetUser() user: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Body() joinChatroomDto: JoinChatroomDto,
  ) {
    const ret = await this.chatService.addChatroomMember(
      chatroomId,
      user.id,
      joinChatroomDto,
    );

    if (!ret) {
      throw new UnprocessableEntityException();
    }
    return ret;
  }

  @Get('room')
  @ApiOkResponse({
    description: `Lists all chatrooms (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [Chatroom],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChatrooms(
    @Query() chatsPaginationQueryDto: PaginationWithSearchQueryDto,
  ): Promise<Chatroom[]> {
    const chatrooms = await this.chatService.retrieveChatrooms(
      chatsPaginationQueryDto,
    );
    if (!chatrooms) {
      throw new ServiceUnavailableException();
    }
    return chatrooms;
  }

  @Get('room/:chatroomId/members')
  @ApiOkResponse({
    description: `Lists all chat members for a given room)`,
    type: [ChatroomMemberWithUser],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async retrieveChatroomMembers(
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @GetUser() user: User,
  ): Promise<ChatroomMemberWithUser[]> {
    const isChatMember = await this.chatroomMemberService.getById(
      chatroomId,
      user.id,
    );
    if (!isChatMember) {
      throw new ForbiddenException();
    }
    const chatroomsMembers =
      await this.chatroomMemberService.retrieveChatroomMembers(chatroomId);
    if (!chatroomsMembers) {
      throw new ServiceUnavailableException();
    }
    return chatroomsMembers;
  }

  @Get('room/:id')
  @ApiCreatedResponse({
    description: 'Get a chatroom',
    type: Chatroom,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getChatroomById(@Param('id', ParseUUIDPipe) chatroomId: string) {
    const chatroom = await this.chatService.getChatroomById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    return chatroom;
  }

  @Get('room/:chatroomId/messages')
  @ApiOkResponse({
    description: `Lists all messages in a chatroom (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [ChatroomMessageWithUser],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChatroomMessages(
    @GetUser() user: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<ChatroomMessageWithUser[] | null> {
    const chatroom = await this.chatService.getChatroomById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    const isChatMember = await this.chatroomMemberService.getById(
      chatroomId,
      user.id,
    );
    if (!isChatMember) {
      throw new ForbiddenException();
    }
    const messages = await this.chatService.getChatroomMessagesWithUser(
      chatroomId,
      paginationQueryDto,
    );
    if (!messages) {
      throw new ServiceUnavailableException();
    }
    return messages;
  }

  @Patch('room/:chatroomId')
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async updateChatroom(
    @GetUser() userMe: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom> {
    const chatroom = await this.chatService.getChatroomById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    if (userMe.id !== chatroom.ownerId) {
      throw new ForbiddenException();
    }
    const updatedChatroom = await this.chatService.updateChatroom(
      chatroomId,
      updateChatroomDto,
    );
    if (!updatedChatroom) {
      throw new UnprocessableEntityException();
    }
    return updatedChatroom;
  }

  @Get(':userId/messages')
  @ApiOkResponse({
    description: `Get chat messages in a one to one conversation(max ${MAX_ENTRIES_PER_PAGE})`,
    type: [ChatMessage],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChatMessages(
    @GetUser() userMe: User,
    @Param('userId', ParseUUIDPipe) recipientId: string,
    @Query() requestDto: PaginationQueryDto,
  ) {
    const messages = await this.chatService.getOneToOneChatMessages(
      userMe.id,
      recipientId,
      requestDto,
    );
    if (!messages) {
      throw new ServiceUnavailableException();
    }
    return messages;
  }
}

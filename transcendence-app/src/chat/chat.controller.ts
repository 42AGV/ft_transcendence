import {
  Body,
  Controller,
  Delete,
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
import { UpdateChatroomMemberDto } from './chatroom/chatroom-member/dto/update-chatroom-member.dto';

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
  ): Promise<Chatroom> {
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
  ): Promise<ChatroomMember> {
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

  @Delete('room/:chatroomId/members')
  @ApiOkResponse({
    description: 'Authenticated user leaves the given chatroom',
    type: ChatroomMember,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async leaveChatroom(
    @GetUser() user: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
  ): Promise<ChatroomMember> {
    const chatroomMember = await this.chatroomMemberService.leaveChatroom(
      chatroomId,
      user.id,
    );
    if (!chatroomMember) {
      throw new ServiceUnavailableException();
    }
    return chatroomMember;
  }

  @Delete('room/:chatroomId/members/:userId')
  @ApiOkResponse({
    description: 'Chatroom admin removes chatroom member',
    type: ChatroomMember,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async removeChatroomMember(
    @GetUser() user: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Param('userId', ParseUUIDPipe) toDeleteUserId: string,
  ): Promise<ChatroomMember> {
    const chatroomMember = await this.chatroomMemberService.removeFromChatroom(
      chatroomId,
      user.id,
      toDeleteUserId,
    );
    if (!chatroomMember) {
      throw new ServiceUnavailableException();
    }
    return chatroomMember;
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

  @Get('room/member')
  @ApiOkResponse({
    description: `Lists all chatrooms the auth user is subscribed to (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [Chatroom],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getAuthChatrooms(
    @GetUser() user: User,
    @Query() chatsPaginationQueryDto: PaginationWithSearchQueryDto,
  ): Promise<Chatroom[]> {
    const chatrooms = await this.chatService.retrieveChatroomsforAuthUser(
      user,
      chatsPaginationQueryDto,
    );
    if (!chatrooms) {
      throw new ServiceUnavailableException();
    }
    return chatrooms;
  }

  @Get('room/:chatroomId/members')
  @ApiOkResponse({
    description: `Lists chat members for a given room (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [ChatroomMemberWithUser],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChatroomMembers(
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @GetUser() user: User,
    @Query() paginationWithSearchQueryDto: PaginationWithSearchQueryDto,
  ): Promise<ChatroomMemberWithUser[]> {
    const isChatMember = await this.chatroomMemberService.getById(
      chatroomId,
      user.id,
    );
    if (!isChatMember || isChatMember.banned) {
      throw new ForbiddenException();
    }
    const chatroomsMembers =
      await this.chatroomMemberService.getChatroomMembers(
        chatroomId,
        paginationWithSearchQueryDto,
      );
    if (!chatroomsMembers) {
      throw new ServiceUnavailableException();
    }
    return chatroomsMembers;
  }

  @Get('room/:chatroomId/members/:userId')
  @ApiOkResponse({
    description: 'Get a chatroom member',
    type: ChatroomMember,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getChatroomMember(
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ChatroomMember> {
    const chatroomMember = await this.chatroomMemberService.getById(
      chatroomId,
      userId,
    );
    if (!chatroomMember) {
      throw new NotFoundException();
    }
    return chatroomMember;
  }

  @Patch('room/:chatroomId/members/:userId')
  @ApiOkResponse({
    description: 'Update a chatroom member',
    type: ChatroomMember,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async updateChatroomMember(
    @GetUser() userMe: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateChatroomMemberDto: UpdateChatroomMemberDto,
  ): Promise<ChatroomMember> {
    const chatroomMember = await this.chatService.updateChatroomMember(
      userMe,
      chatroomId,
      userId,
      updateChatroomMemberDto,
    );
    if (!chatroomMember) {
      throw new ServiceUnavailableException();
    }
    return chatroomMember;
  }

  @Get('room/:id')
  @ApiOkResponse({
    description: 'Get a chatroom',
    type: Chatroom,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getChatroomById(
    @Param('id', ParseUUIDPipe) chatroomId: string,
  ): Promise<Chatroom> {
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
    if (!isChatMember || isChatMember.banned) {
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
  @ApiOkResponse({
    description: 'Update a chatroom',
    type: Chatroom,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async updateChatroom(
    @GetUser() userMe: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom> {
    const updatedChatroom = await this.chatService.updateChatroom(
      userMe,
      chatroomId,
      updateChatroomDto,
    );
    if (!updatedChatroom) {
      throw new UnprocessableEntityException();
    }
    return updatedChatroom;
  }

  @Delete('room/:chatroomId')
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailabe' })
  async deleteChatroom(
    @GetUser() userMe: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
  ): Promise<Chatroom> {
    const chatroom = await this.chatService.getChatroomById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    if (userMe.id !== chatroom.ownerId) {
      throw new ForbiddenException();
    }
    const deletedChatroom = await this.chatService.deleteChatroom(chatroomId);
    if (!deletedChatroom) {
      throw new ServiceUnavailableException();
    }
    return deletedChatroom;
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
  ): Promise<ChatMessage[]> {
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

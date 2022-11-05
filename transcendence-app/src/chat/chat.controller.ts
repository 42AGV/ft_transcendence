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
import { Chatroom } from './chatroom/chatroom.domain';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatroomDto } from './chatroom/dto/create-chatroom.dto';
import { User } from '../user/user.domain';
import { User as GetUser } from '../user/decorators/user.decorator';
import { ChatroomPaginationQueryDto } from './chatroom/dto/chatroom.pagination.dto';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import { ChatroomMember } from './chatroom/chatroom-member/chatroom-member.domain';
import { ChatroomMemberAsUserResponseDto } from './chatroom/chatroom-member/dto/chatroom-member.dto';
import { PaginationQueryDto } from '../shared/dtos/pagination-query.dto';
import { ChatroomMessageWithUser } from './chatroom/chatroom-message/chatroom-message-with-user.domain';
import { UpdateChatroomDto } from './chatroom/dto/update-chatroom.dto';

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
  ) {
    const ret = await this.chatroomMemberService.addChatroomMember(
      chatroomId,
      user.id,
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
    @Query() chatsPaginationQueryDto: ChatroomPaginationQueryDto,
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
    type: [ChatroomMemberAsUserResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async retrieveChatroomMembers(
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @GetUser() user: User,
  ): Promise<ChatroomMemberAsUserResponseDto[]> {
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
    description: 'get a chatroom',
    type: Chatroom,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
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
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async updateChatroom(
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom> {
    const updatedChatroom = await this.chatService.updateChatroom(
      chatroomId,
      updateChatroomDto,
    );
    if (!updatedChatroom) {
      throw new UnprocessableEntityException();
    }
    return updatedChatroom;
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
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
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatDto } from './dto/create-chat.dto';
import { User as GetUser } from '../user/decorators/user.decorator';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';
import { ChatMemberService } from './chatmember.service';
import { ChatmemberAsUserResponseDto } from './dto/chatmember.dto';
import { PaginationQueryDto } from '../shared/dtos/pagination-query.dto';
import { ChatRoom } from './infrastructure/db/chat.entity';
import { User } from '../user/infrastructure/db/user.entity';
import { ChatMember } from './infrastructure/db/chatmember.entity';
import { ChatRoomMessageWithUser } from './infrastructure/db/chat-room-message-with-user.entity';

@Controller('chat')
@UseGuards(AuthenticatedGuard)
@ApiTags('chat')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatMemberService: ChatMemberService,
  ) {}

  @Post('room')
  @ApiCreatedResponse({ description: 'Create a chatroom', type: ChatRoom })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async createChatRoom(
    @GetUser() user: User,
    @Body() createChatDto: CreateChatDto,
  ) {
    const chatRoom = await this.chatService.createChatRoom(
      user.id,
      createChatDto,
    );

    if (!chatRoom) {
      throw new UnprocessableEntityException();
    }
    return chatRoom;
  }

  @Post('room/:chatRoomId/members')
  @ApiCreatedResponse({
    description: 'Add a member to a chatroom',
    type: ChatMember,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async createChatRoomMember(
    @GetUser() user: User,
    @Param('chatRoomId', ParseUUIDPipe) chatRoomId: string,
  ) {
    const ret = await this.chatMemberService.addChatMember(chatRoomId, user.id);

    if (!ret) {
      throw new UnprocessableEntityException();
    }
    return ret;
  }

  @Get('room')
  @ApiOkResponse({
    description: `Lists all chatrooms (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [ChatRoom],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChatRooms(
    @Query() chatsPaginationQueryDto: ChatsPaginationQueryDto,
  ): Promise<ChatRoom[]> {
    const chatRooms = await this.chatService.retrieveChatRooms(
      chatsPaginationQueryDto,
    );
    if (!chatRooms) {
      throw new ServiceUnavailableException();
    }
    return chatRooms;
  }

  @Get('room/:chatroomId/members')
  @ApiOkResponse({
    description: `Lists all chat members for a given room)`,
    type: [ChatmemberAsUserResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async retrieveChatroomMembers(
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @GetUser() user: User,
  ): Promise<ChatmemberAsUserResponseDto[]> {
    const isChatMember = await this.chatMemberService.getById(
      chatroomId,
      user.id,
    );
    if (!isChatMember) {
      throw new ForbiddenException();
    }
    const chatroomsMembers =
      await this.chatMemberService.retrieveChatRoomMembers(chatroomId);
    if (!chatroomsMembers) {
      throw new ServiceUnavailableException();
    }
    return chatroomsMembers;
  }

  @Get('room/:id')
  @ApiCreatedResponse({
    description: 'get a chatroom',
    type: ChatRoom,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async getChatRoomById(@Param('id', ParseUUIDPipe) chatRoomId: string) {
    const chatroom = await this.chatService.getChatroomById(chatRoomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    return chatroom;
  }

  @Get('chat/room/:chatroomId/messages')
  @ApiOkResponse({
    description: `Lists all messages in a chatroom (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [ChatRoomMessageWithUser],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChatroomMessages(
    @GetUser() user: User,
    @Param('chatroomId', ParseUUIDPipe) chatroomId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<ChatRoomMessageWithUser[] | null> {
    const chatroom = await this.chatService.getChatroomById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    const isChatMember = await this.chatMemberService.getById(
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
}

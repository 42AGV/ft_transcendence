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
import { ChatmemberAsUserResponseDto } from './dto/chatmember.dto';

@Controller('chat')
@UseGuards(AuthenticatedGuard)
@ApiTags('chat')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatMemberService: ChatroomMemberService,
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
    @Param('chatroomId', ParseUUIDPipe) chatRoomId: string,
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

  @Get('room/:chatRoomId/members')
  @ApiOkResponse({
    description: `Lists all chat members for a given room)`,
    type: [ChatmemberAsUserResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async retrieveChatRoomMembers(
    @Param('chatRoomId', ParseUUIDPipe) chatRoomId: string,
    @GetUser() user: User,
  ): Promise<ChatmemberAsUserResponseDto[]> {
    const chatRoomsMembers =
      await this.chatMemberService.retrieveChatRoomMembers(chatRoomId);
    if (!chatRoomsMembers) {
      throw new ServiceUnavailableException();
    }
    if (!chatRoomsMembers.some((x) => x.username === user.username)) {
      throw new ForbiddenException();
    }
    return chatRoomsMembers;
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
}

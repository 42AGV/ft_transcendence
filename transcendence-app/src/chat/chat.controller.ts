import {
  Body,
  Controller,
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
import { ChatRoom } from './chat.domain';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from '../user/user.domain';
import { User as GetUser } from '../user/decorators/user.decorator';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';
import { ChatMemberService } from './chatmember.service';
import { ChatMember } from './chatmember.domain';
import { ChatmemberAsUserResponseDto } from './dto/chatmember.dto';

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

  @Get('room/:chatRoomId/members')
  @ApiOkResponse({
    description: `Lists all chat members for a given room)`,
    type: [ChatmemberAsUserResponseDto],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async retrieveChatRoomMembers(
    @Param('chatRoomId', ParseUUIDPipe) chatRoomId: string,
  ): Promise<ChatmemberAsUserResponseDto[]> {
    const chatRoomsMembers =
      await this.chatMemberService.retrieveChatRoomMembers(chatRoomId);
    if (!chatRoomsMembers) {
      throw new NotFoundException();
    }
    return chatRoomsMembers;
  }

  @Get('room/:id')
  @ApiCreatedResponse({
    description: 'get a chatroom',
    type: ChatRoom,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async getChatRoomById(@Param('id', ParseUUIDPipe) chatRoomId: string) {
    const chatroom = await this.chatService.getChatRoomById(chatRoomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    return chatroom;
  }
}

import {
  Body,
  Controller,
  Get,
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

  @Post(':chatId/members')
  @ApiCreatedResponse({
    description: 'Add a member to a chatroom',
    type: ChatMember,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async createChatRoomMember(
    @GetUser() user: User,
    @Param('chatId', ParseUUIDPipe) chatId: string,
  ) {
    const ret = await this.chatMemberService.addChatmember(chatId, user.id);

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
}

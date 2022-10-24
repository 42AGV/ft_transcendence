import {
  Body,
  Controller,
  Get,
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
import { Chat } from './chat.domain';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from '../user/user.domain';
import { User as GetUser } from '../user/decorators/user.decorator';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';

@Controller('chatroom')
@UseGuards(AuthenticatedGuard)
@ApiTags('chatroom')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create a chatroom', type: Chat })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async createChat(
    @GetUser() user: User,
    @Body() createChatDto: CreateChatDto,
  ) {
    const chat = await this.chatService.createChat(user.id, createChatDto);

    if (!chat) {
      throw new UnprocessableEntityException();
    }
    return chat;
  }

  @Get()
  @ApiOkResponse({
    description: `Lists all chatrooms (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [Chat],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChats(
    @Query() chatsPaginationQueryDto: ChatsPaginationQueryDto,
  ): Promise<Chat[]> {
    const Chats = await this.chatService.retrieveChats(chatsPaginationQueryDto);
    if (!Chats) {
      throw new ServiceUnavailableException();
    }
    return Chats;
  }
}

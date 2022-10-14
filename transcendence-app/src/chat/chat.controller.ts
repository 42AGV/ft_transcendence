import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  ServiceUnavailableException,
  StreamableFile,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiPayloadTooLargeResponse,
  ApiProduces,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';
import { Chat as GetChat } from './decorators/chat.decorator';
import { Chat } from './chat.domain';
import LocalFileInterceptor from '../shared/local-file/local-file.interceptor';
import {
  AVATARS_PATH,
  AVATAR_MAX_SIZE,
  AVATAR_MIMETYPE_WHITELIST,
  MAX_ENTRIES_PER_PAGE,
} from '../shared/constants';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiFile } from '../shared/decorators/api-file.decorator';
import { CreateChatDto } from './dto/create-chat.dto';

export const AvatarFileInterceptor = LocalFileInterceptor({
  fieldName: 'file',
  path: AVATARS_PATH,
  fileFilter: (request, file, callback) => {
    if (!AVATAR_MIMETYPE_WHITELIST.includes(file.mimetype)) {
      const allowedTypes = AVATAR_MIMETYPE_WHITELIST.join(', ');
      return callback(
        new UnprocessableEntityException(
          `Validation failed (allowed types are ${allowedTypes})`,
        ),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: AVATAR_MAX_SIZE,
  },
});

@Controller('Chats')
@UseGuards(AuthenticatedGuard)
@ApiTags('Chats')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create a chat', type: Chat })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addChat(@Body() chatDto: CreateChatDto): Promise<Chat> {
    const chat = await this.chatService.addChat(chatDto);
    if (!chat) {
      throw new UnprocessableEntityException();
    }
    return chat;
  }

  @Patch()
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  async updateCurrentChat(
    @GetChat() chat: Chat,
    @Body() updateChatDto: UpdateChatDto,
  ): Promise<Chat> {
    const updatedChat = await this.chatService.updateChat(
      chat.id,
      updateChatDto,
    );
    if (!updatedChat) {
      throw new UnprocessableEntityException();
    }
    return chat;
  }

  @Get()
  @ApiOkResponse({
    description: `Lists all Chats (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [Chat],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getChats(
    @Query() ChatsPaginationQueryDto: ChatsPaginationQueryDto,
  ): Promise<Chat[]> {
    const Chats = await this.chatService.retrieveChats(ChatsPaginationQueryDto);
    if (!Chats) {
      throw new ServiceUnavailableException();
    }
    return Chats;
  }

  @Get('avatars/:avatarId')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getAvatarByAvatarId(
    @Param('avatarId', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const streamableFile = await this.chatService.getAvatarByAvatarId(id);

    if (!streamableFile) {
      throw new NotFoundException();
    }
    return streamableFile;
  }

  @Get(':chatId')
  @ApiOkResponse({ description: 'Get a chat', type: Chat })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async getChatById(
    @Param('chatId', ParseUUIDPipe) uuid: string,
  ): Promise<Chat> {
    const chat = await this.chatService.retrieveChatWithId(uuid);
    if (chat === null) {
      throw new NotFoundException();
    }
    return chat;
  }

  @Put('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @ApiProduces('image/jpeg')
  @ApiOkResponse({
    schema: {
      type: 'file',
      format: 'binary',
    },
  })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' })
  @ApiPayloadTooLargeResponse({ description: 'Payload Too Large' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @UseInterceptors(AvatarFileInterceptor)
  async uploadAvatar(
    @GetChat() chat: Chat,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<StreamableFile> {
    if (!file) {
      throw new UnprocessableEntityException();
    }

    const isValid = await this.chatService.validateAvatarType(file.path);
    if (!isValid) {
      const allowedTypes = AVATAR_MIMETYPE_WHITELIST.join(', ');
      throw new UnprocessableEntityException(
        `Validation failed (allowed types are ${allowedTypes})`,
      );
    }

    const avatar = await this.chatService.addAvatar(chat, {
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });

    if (!avatar) {
      throw new ServiceUnavailableException();
    }
    return avatar;
  }
}

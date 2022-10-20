import { Injectable, StreamableFile } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from 'src/shared/enums/boolean-string.enum';
import { LocalFileService } from 'src/shared/local-file/local-file.service';
import { Chat } from './chat.domain';
import { ChatDto } from './dto/chat.dto';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';
import { IChatRepository } from './infrastructure/db/chat.repository';
import { LocalFileDto } from 'src/shared/local-file/local-file.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { loadEsmModule } from 'src/shared/utils';
import {
  AVATAR_MIMETYPE_WHITELIST,
  MAX_ENTRIES_PER_PAGE,
} from '../shared/constants';
import { createReadStream } from 'fs';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: IChatRepository,
    private localFileService: LocalFileService,
  ) {}

  async retrieveChatWithId(id: string): Promise<Chat | null> {
    const chat = await this.chatRepository.getById(id);
    return chat ? new Chat(chat) : null;
  }

  async retrieveChats({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: ChatsPaginationQueryDto): Promise<Chat[] | null> {
    const chats = await this.chatRepository.getPaginatedChats({
      limit,
      offset,
      sort,
      search,
    });
    return chats ? chats.map((chat) => new Chat(chat)) : null;
  }

  async retrieveChatWithChatName(chatName: string): Promise<Chat | null> {
    const chat = await this.chatRepository.getByChatName(chatName);
    return chat ? new Chat(chat) : null;
  }

  async addChat(chatDto: CreateChatDto): Promise<Chat | null> {
    const chat = await this.chatRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      avatarId: null,
      ...chatDto,
    });
    return chat ? new Chat(chat) : null;
  }

  async addAvatarAndChat(
    fileDto: LocalFileDto,
    chatDto: ChatDto,
  ): Promise<Chat | null> {
    const chat = await this.chatRepository.addAvatarAndAddChat(
      { id: uuidv4(), createdAt: new Date(Date.now()), ...fileDto },
      {
        id: uuidv4(),
        createdAt: new Date(Date.now()),
        avatarX: 0,
        avatarY: 0,
        ...chatDto,
      },
    );
    return chat ? new Chat(chat) : null;
  }

  async updateChat(
    chatId: string,
    updateChatDto: UpdateChatDto,
  ): Promise<Chat | null> {
    const chat = await this.chatRepository.updateById(chatId, updateChatDto);
    return chat ? new Chat(chat) : null;
  }

  async getAvatarByAvatarId(avatarId: string): Promise<StreamableFile | null> {
    const file = await this.localFileService.getFileById(avatarId);

    if (!file) {
      return null;
    }
    return this.streamAvatarData(file);
  }

  private async addAvatarAndUpdateChat(
    chat: Chat,
    newAvatarFileDto: LocalFileDto,
  ): Promise<StreamableFile | null> {
    const updatedChat = await this.chatRepository.addAvatarAndUpdateChat(
      { id: uuidv4(), createdAt: new Date(Date.now()), ...newAvatarFileDto },
      chat,
    );
    if (!updatedChat) {
      this.localFileService.deleteFileData(newAvatarFileDto.path);
      return null;
    }
    return this.streamAvatarData(newAvatarFileDto);
  }

  private async deleteAvatar(avatarId: string) {
    const avatarFile = await this.localFileService.deleteFileById(avatarId);
    if (avatarFile) {
      this.localFileService.deleteFileData(avatarFile.path);
    }
  }

  async addAvatar(
    chat: Chat,
    newAvatarFileDto: LocalFileDto,
  ): Promise<StreamableFile | null> {
    const previousAvatarId = chat.avatarId;
    const avatar = await this.addAvatarAndUpdateChat(chat, newAvatarFileDto);
    if (!avatar) {
      return null;
    }
    if (previousAvatarId) {
      await this.deleteAvatar(previousAvatarId);
    }
    return avatar;
  }

  private streamAvatarData(fileDto: LocalFileDto): StreamableFile {
    const stream = createReadStream(fileDto.path);

    return new StreamableFile(stream, {
      type: fileDto.mimetype,
      disposition: `inline; filename="${fileDto.filename}"`,
      length: fileDto.size,
    });
  }

  async validateAvatarType(path: string): Promise<boolean | undefined> {
    /**
     * Import 'file-type' ES-Module in CommonJS Node.js module
     */
    const { fileTypeFromFile } = await loadEsmModule<
      typeof import('file-type')
    >('file-type');
    const fileTypeResult = await fileTypeFromFile(path);
    const isValid =
      fileTypeResult && AVATAR_MIMETYPE_WHITELIST.includes(fileTypeResult.mime);
    if (!isValid) {
      this.localFileService.deleteFileData(path);
    }
    return isValid;
  }
}

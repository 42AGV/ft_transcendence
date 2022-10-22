import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { LocalFileService } from '../shared/local-file/local-file.service';
import { Chat } from './chat.domain';
import { ChatDto } from './dto/chat.dto';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';
import { IChatRepository } from './infrastructure/db/chat.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatDto } from './dto/create-chat.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class ChatService {
  readonly saltLength = 8;
  readonly hashLength = 32;

  constructor(
    private chatRepository: IChatRepository,
    private localFileService: LocalFileService,
  ) {}

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

  async addChat(chatDto: ChatDto): Promise<Chat | null> {
    const chatcompl = {
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...chatDto,
    };
    const chat = await this.chatRepository.add(chatcompl);
    return chat ? new Chat(chat) : null;
  }

  async createChat(ownerId: string, chat: CreateChatDto) {
    const { confirmationPassword: _, ...newChat } = chat;
    if (chat.password) {
      if (chat.password !== chat.confirmationPassword) {
        throw new BadRequestException(
          'Password and Confirmation Password must match',
        );
      }

      const salt = randomBytes(this.saltLength).toString('hex');
      const hash = (await scrypt(
        chat.password,
        salt,
        this.hashLength,
      )) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      return this.addChat({
        ...newChat,
        avatarId: null,
        password: result,
        owner: ownerId,
      });
    } else {
      return this.addChat({
        ...newChat,
        avatarId: null,
        owner: ownerId,
      });
    }
  }
}

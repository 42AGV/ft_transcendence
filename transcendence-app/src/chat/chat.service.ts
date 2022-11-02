import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { Chatroom } from './chatroom/infrastructure/db/chatroom.entity';
import { ChatroomPaginationQueryDto } from './chatroom/dto/chatroom.pagination.dto';
import { IChatroomRepository } from './chatroom/infrastructure/db/chatroom.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatroomDto } from './chatroom/dto/create-chatroom.dto';
import { ChatroomMessageWithUser } from './chatroom/chatroom-message/infrastructure/db/chatroom-message-with-user.entity';
import { IChatroomMessageRepository } from './chatroom/chatroom-message/infrastructure/db/chatroom-message.repository';
import { PaginationQueryDto } from '../shared/dtos/pagination-query.dto';
import { Password } from '../shared/password';
import { ChatMessageQueryDto } from './dto/chat-message.query.dto';
import { IChatMessageRepository } from './chat/infrastructure/db/chat-message.repository';
import { ChatMessagePaginationRequestDto } from './dto/chat-message-paginated.request.dto';
import { ChatMessage } from './chat/chat-message.domain';

@Injectable()
export class ChatService {
  constructor(
    private chatMessageRepository: IChatMessageRepository,
    private chatroomRepository: IChatroomRepository,
    private chatroomMessageRepository: IChatroomMessageRepository,
  ) {}

  async retrieveChatrooms({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: ChatroomPaginationQueryDto): Promise<Chatroom[] | null> {
    return this.chatroomRepository.getPaginatedChatrooms({
      limit,
      offset,
      sort,
      search,
    });
  }

  private async addChatroom(
    chatroom: Partial<Chatroom>,
  ): Promise<Chatroom | null> {
    return this.chatroomRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...chatroom,
    });
  }

  async createChatroom(ownerId: string, chatroom: CreateChatroomDto) {
    const { confirmationPassword: _, ...newChat } = chatroom;
    if (chatroom.password) {
      if (chatroom.password !== chatroom.confirmationPassword) {
        throw new BadRequestException(
          'Password and Confirmation Password must match',
        );
      }

      const hashedPassword = await Password.toHash(chatroom.password);
      return this.addChatroom({
        ...newChat,
        avatarId: null,
        password: hashedPassword,
        ownerId: ownerId,
      });
    } else {
      return this.addChatroom({
        ...newChat,
        avatarId: null,
        ownerId: ownerId,
      });
    }
  }

  getChatroomById(chatroomId: string): Promise<Chatroom | null> {
    return this.chatroomRepository.getById(chatroomId);
  }

  getChatroomMessagesWithUser(
    chatroomId: string,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<ChatroomMessageWithUser[] | null> {
    return this.chatroomMessageRepository.getWithUser(chatroomId, {
      limit,
      offset,
    });
  }

  async saveOneToOneChatMessage(
    message: ChatMessageQueryDto,
  ): Promise<ChatMessage | null> {
    const msgEntity = await this.chatMessageRepository.addMessageSet(message);
    return msgEntity ? new ChatMessage(msgEntity) : null;
  }

  async getOneToOneChatMessages(
    meId: string,
    recipientId: string,
    request: ChatMessagePaginationRequestDto,
  ): Promise<ChatMessage[] | null> {
    const msgEntities = await this.chatMessageRepository.getPaginatedMessages({
      limit: request.limit ?? MAX_ENTRIES_PER_PAGE,
      offset: request.offset ?? 0,
      user1Id: meId,
      user2Id: recipientId,
    });
    return msgEntities ? msgEntities.map((e) => new ChatMessage(e)) : null;
  }
}

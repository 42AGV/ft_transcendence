import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { ChatDto } from './dto/chat.dto';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';
import { IChatRepository } from './infrastructure/db/chat.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatDto } from './dto/create-chat.dto';
import { IChatroomMessageRepository } from './infrastructure/db/chatroom-message.repository';
import { PaginationQueryDto } from '../shared/dtos/pagination-query.dto';
import { Password } from '../shared/password';
import { ChatRoom } from './infrastructure/db/chat.entity';
import { ChatRoomMessageWithUser } from './infrastructure/db/chat-room-message-with-user.entity';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: IChatRepository,
    private chatRoomMessageRepository: IChatroomMessageRepository,
  ) {}

  retrieveChatRooms({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: ChatsPaginationQueryDto): Promise<ChatRoom[] | null> {
    return this.chatRepository.getPaginatedChatRooms({
      limit,
      offset,
      sort,
      search,
    });
  }

  private addChatRoom(chatDto: ChatDto): Promise<ChatRoom | null> {
    return this.chatRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...chatDto,
    });
  }

  async createChatRoom(ownerId: string, chatRoom: CreateChatDto) {
    const { confirmationPassword: _, ...newChat } = chatRoom;
    if (chatRoom.password) {
      if (chatRoom.password !== chatRoom.confirmationPassword) {
        throw new BadRequestException(
          'Password and Confirmation Password must match',
        );
      }

      const hashedPassword = await Password.toHash(chatRoom.password);
      return this.addChatRoom({
        ...newChat,
        avatarId: null,
        password: hashedPassword,
        ownerId: ownerId,
      });
    } else {
      return this.addChatRoom({
        ...newChat,
        avatarId: null,
        ownerId: ownerId,
      });
    }
  }

  getChatroomById(chatroomId: string): Promise<ChatRoom | null> {
    return this.chatRepository.getById(chatroomId);
  }

  getChatroomMessagesWithUser(
    chatroomId: string,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<ChatRoomMessageWithUser[] | null> {
    return this.chatRoomMessageRepository.getWithUser(chatroomId, {
      limit,
      offset,
    });
  }
}

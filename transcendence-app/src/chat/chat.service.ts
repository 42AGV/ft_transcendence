import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { ChatRoom } from './chat.domain';
import { ChatDto } from './dto/chat.dto';
import { ChatsPaginationQueryDto } from './dto/chat.pagination.dto';
import { IChatRepository } from './infrastructure/db/chat.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatDto } from './dto/create-chat.dto';
import { Password } from '../shared/password';

@Injectable()
export class ChatService {
  constructor(private chatRepository: IChatRepository) {}

  async retrieveChatRooms({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: ChatsPaginationQueryDto): Promise<ChatRoom[] | null> {
    const chatRooms = await this.chatRepository.getPaginatedChatRooms({
      limit,
      offset,
      sort,
      search,
    });
    return chatRooms
      ? chatRooms.map((chatRoom) => new ChatRoom(chatRoom))
      : null;
  }

  private async addChatRoom(chatDto: ChatDto): Promise<ChatRoom | null> {
    const chatRoom = await this.chatRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...chatDto,
    });
    return chatRoom ? new ChatRoom(chatRoom) : null;
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

  async getChatRoomById(chatRoomId: string): Promise<ChatRoom | null> {
    const chatRoom = await this.chatRepository.getById(chatRoomId);
    return chatRoom ? new ChatRoom(chatRoom) : null;
  }
}

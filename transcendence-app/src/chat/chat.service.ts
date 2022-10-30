import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { Chatroom } from './chatroom/chatroom.domain';
import { ChatroomDto } from './chatroom/dto/chatroom.dto';
import { ChatroomPaginationQueryDto } from './chatroom/dto/chatroom.pagination.dto';
import { IChatroomRepository } from './chatroom/infrastructure/chatroom.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatroomDto } from './chatroom/dto/create-chatroom.dto';
import { Password } from '../shared/password';

@Injectable()
export class ChatService {
  readonly saltLength = 8;
  readonly hashLength = 32;

  constructor(private chatRepository: IChatroomRepository) {}

  async retrieveChatRooms({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: ChatroomPaginationQueryDto): Promise<Chatroom[] | null> {
    const chatRooms = await this.chatRepository.getPaginatedChatRooms({
      limit,
      offset,
      sort,
      search,
    });
    return chatRooms
      ? chatRooms.map((chatRoom) => new Chatroom(chatRoom))
      : null;
  }

  private async addChatRoom(chatDto: ChatroomDto): Promise<Chatroom | null> {
    const chatRoom = await this.chatRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...chatDto,
    });
    return chatRoom ? new Chatroom(chatRoom) : null;
  }

  async createChatRoom(ownerId: string, chatRoom: CreateChatroomDto) {
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

  async getChatRoomById(chatRoomId: string): Promise<Chatroom | null> {
    const chatRoom = await this.chatRepository.getById(chatRoomId);
    return chatRoom ? new Chatroom(chatRoom) : null;
  }
}

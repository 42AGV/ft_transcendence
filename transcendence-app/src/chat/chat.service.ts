import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { Chatroom } from './chatroom/chatroom.domain';
import { ChatroomDto } from './chatroom/dto/chatroom.dto';
import { ChatroomPaginationQueryDto } from './chatroom/dto/chatroom.pagination.dto';
import { IChatroomRepository } from './chatroom/infrastructure/db/chatroom.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatroomDto } from './chatroom/dto/create-chatroom.dto';
import { ChatroomMessageWithUser } from './chatroom/chatroom-message/chatroom-message-with-user.domain';
import { IChatroomMessageRepository } from './chatroom/chatroom-message/infrastructure/db/chatroom-message.repository';
import { PaginationQueryDto } from '../shared/dtos/pagination-query.dto';
import { Password } from '../shared/password';
import { UpdateChatroomDto } from './chatroom/dto/update-chatroom.dto';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: IChatroomRepository,
    private chatRoomMessageRepository: IChatroomMessageRepository,
  ) {}

  async retrieveChatrooms({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: ChatroomPaginationQueryDto): Promise<Chatroom[] | null> {
    const chatrooms = await this.chatRepository.getPaginatedChatrooms({
      limit,
      offset,
      sort,
      search,
    });
    return chatrooms
      ? chatrooms.map((chatroom) => new Chatroom(chatroom))
      : null;
  }

  private async addChatroom(chatDto: ChatroomDto): Promise<Chatroom | null> {
    const chatroom = await this.chatRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...chatDto,
    });
    return chatroom ? new Chatroom(chatroom) : null;
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

  async getChatroomById(chatroomId: string): Promise<Chatroom | null> {
    const chatroom = await this.chatRepository.getById(chatroomId);
    return chatroom ? new Chatroom(chatroom) : null;
  }

  async getChatroomMessagesWithUser(
    chatroomId: string,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<ChatroomMessageWithUser[] | null> {
    const messages = await this.chatRoomMessageRepository.getWithUser(
      chatroomId,
      { limit, offset },
    );
    return messages
      ? messages.map((message) => new ChatroomMessageWithUser(message))
      : null;
  }

  async updateChatroom(
    chatroomId: string,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom | null> {
    const { confirmationPassword: _, ...updateChatroom } = updateChatroomDto;
    if (updateChatroomDto.password) {
      if (
        updateChatroomDto.password !== updateChatroomDto.confirmationPassword
      ) {
        throw new BadRequestException(
          'Password and Confirmation Password must match',
        );
      } else {
        const hashedPassword = await Password.toHash(
          updateChatroomDto.password,
        );
        const ret = this.chatRepository.updateById(chatroomId, {
          ...updateChatroom,
          password: hashedPassword,
        });
        return await ret;
      }
    } else {
      return await this.chatRepository.updateById(chatroomId, updateChatroom);
    }
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { Chatroom } from './chatroom/infrastructure/db/chatroom.entity';
import { IChatroomRepository } from './chatroom/infrastructure/db/chatroom.repository';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { CreateChatroomDto } from './chatroom/dto/create-chatroom.dto';
import { ChatroomMessageWithUser } from './chatroom/chatroom-message/infrastructure/db/chatroom-message-with-user.entity';
import { IChatroomMessageRepository } from './chatroom/chatroom-message/infrastructure/db/chatroom-message.repository';
import { PaginationQueryDto } from '../shared/dtos/pagination.query.dto';
import { Password } from '../shared/password';
import { UpdateChatroomDto } from './chatroom/dto/update-chatroom.dto';
import { IChatMessageRepository } from './chat/infrastructure/db/chat-message.repository';
import { ChatMessage } from './chat/infrastructure/db/chat-message.entity';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { ChatroomMessage } from './chatroom/chatroom-message/infrastructure/db/chatroom-message.entity';
import { JoinChatroomDto } from './chatroom/dto/join-chatroom.dto';
import { ChatroomMember } from './chatroom/chatroom-member/infrastructure/db/chatroom-member.entity';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';

@Injectable()
export class ChatService {
  constructor(
    private chatMessageRepository: IChatMessageRepository,
    private chatroomRepository: IChatroomRepository,
    private chatroomMessageRepository: IChatroomMessageRepository,
    private chatroomMemberService: ChatroomMemberService,
  ) {}

  async retrieveChatrooms({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: PaginationWithSearchQueryDto): Promise<Chatroom[] | null> {
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
    return this.chatroomRepository.addChatroom({
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
    message: ChatMessage,
  ): Promise<ChatMessage | null> {
    return this.chatMessageRepository.add(message);
  }

  async getOneToOneChatMessages(
    userMeId: string,
    recipientId: string,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<ChatMessage[] | null> {
    return this.chatMessageRepository.getPaginatedMessages(
      userMeId,
      recipientId,
      {
        limit,
        offset,
      },
    );
  }

  async updateChatroom(
    chatroomId: string,
    updateChatroomDto: UpdateChatroomDto,
  ): Promise<Chatroom | null> {
    const { oldPassword, confirmationPassword, isPublic, ...updateChatroom } =
      updateChatroomDto;
    const chatroom = await this.getChatroomById(chatroomId);
    if (!chatroom) {
      throw new NotFoundException();
    }
    if (
      !chatroom.isPublic &&
      !updateChatroomDto.isPublic &&
      updateChatroomDto.password === null
    ) {
      return await this.chatroomRepository.updateById(chatroomId, {
        ...updateChatroom,
        password: chatroom.password,
      });
    }
    if (
      (!chatroom.isPublic &&
        !updateChatroomDto.isPublic &&
        chatroom.password &&
        !updateChatroomDto.oldPassword) ||
      (updateChatroomDto.oldPassword &&
        (await Password.compare(
          chatroom.password!,
          updateChatroomDto.oldPassword,
        )) === false)
    ) {
      throw new ForbiddenException('Incorrect password');
    }

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
        const ret = this.chatroomRepository.updateById(chatroomId, {
          ...updateChatroom,
          password: hashedPassword,
        });
        return await ret;
      }
    } else {
      return await this.chatroomRepository.updateById(
        chatroomId,
        updateChatroom,
      );
    }
  }

  async deleteChatroom(chatroomId: string): Promise<Chatroom | null> {
    return this.chatroomRepository.deleteById(chatroomId);
  }

  addChatroomMessage(chatroomMessage: Partial<ChatroomMessage>) {
    return this.chatroomMessageRepository.add(chatroomMessage);
  }

  async addChatroomMember(
    chatroomId: string,
    userId: string,
    joinChatroomDto: JoinChatroomDto,
  ): Promise<ChatroomMember | null> {
    const foundChatroom = await this.getChatroomById(chatroomId);
    if (!foundChatroom) {
      throw new NotFoundException('Chatroom not found');
    }
    const { password, confirmationPassword } = joinChatroomDto;
    if (password !== confirmationPassword) {
      throw new BadRequestException(
        'Password and Confirmation Password must match',
      );
    }
    if (
      foundChatroom.password &&
      (!password ||
        (await Password.compare(foundChatroom.password, password)) === false)
    ) {
      throw new ForbiddenException('Incorrect password');
    }
    return this.chatroomMemberService.addChatroomMember(chatroomId, userId);
  }
}

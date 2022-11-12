import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IChatroomMemberRepository } from './infrastructure/db/chatroom-member.repository';
import {
  ChatroomMember,
  ChatroomMemberWithUser,
} from './infrastructure/db/chatroom-member.entity';
import { IChatroomRepository } from '../infrastructure/db/chatroom.repository';
import { MAX_ENTRIES_PER_PAGE } from '../../../shared/constants';
import { PaginationQueryDto } from '../../../shared/dtos/pagination.query.dto';

@Injectable()
export class ChatroomMemberService {
  constructor(
    private chatroomMemberRepository: IChatroomMemberRepository,
    private chatroomRepository: IChatroomRepository,
  ) {}

  async addChatroomMember(
    chatId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const chatmember = {
      joinedAt: new Date(Date.now()),
      chatId: chatId,
      userId: userId,
      admin: false,
      muted: false,
      banned: false,
    };
    const ret = await this.chatroomMemberRepository.addChatroomMember(
      chatmember,
    );
    return ret ? new ChatroomMember(ret) : null;
  }

  async getById(
    chatId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const chatMember = await this.chatroomMemberRepository.getById(
      chatId,
      userId,
    );
    return chatMember && !chatMember.banned ? chatMember : null;
  }

  async leaveChatroom(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null> {
    const foundChatroom = await this.chatroomRepository.getById(chatroomId);
    if (!foundChatroom) {
      throw new NotFoundException();
    }
    const foundChatroomMember = await this.chatroomMemberRepository.getById(
      chatroomId,
      userId,
    );
    if (!foundChatroomMember) {
      throw new NotFoundException();
    }
    if (foundChatroom.ownerId === userId) {
      const chatroom = await this.chatroomRepository.deleteById(chatroomId);
      if (!chatroom) {
        throw new ServiceUnavailableException();
      }
      return foundChatroomMember;
    }
    if (foundChatroomMember.banned || foundChatroomMember.muted) {
      return this.chatroomMemberRepository.updateById(chatroomId, userId, {
        joinedAt: null,
      });
    }
    return this.chatroomMemberRepository.deleteById(chatroomId, userId);
  }

  retrieveChatroomMembers(
    chatroomId: string,
    { limit = MAX_ENTRIES_PER_PAGE, offset = 0 }: PaginationQueryDto,
  ): Promise<ChatroomMemberWithUser[] | null> {
    return this.chatroomMemberRepository.getPaginatedChatroomMembers(
      chatroomId,
      {
        limit,
        offset,
      },
    );
  }
}

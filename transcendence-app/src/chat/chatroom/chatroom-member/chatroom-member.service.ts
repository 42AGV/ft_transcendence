import { Injectable } from '@nestjs/common';
import { IChatroomMemberRepository } from './infrastructure/db/chatroom-member.repository';
import {
  ChatroomMember,
  ChatroomMemberWithUser,
} from './infrastructure/db/chatroom-member.entity';

@Injectable()
export class ChatroomMemberService {
  constructor(private chatroomMemberRepository: IChatroomMemberRepository) {}

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
    const ret = await this.chatroomMemberRepository.add(chatmember);
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

  retrieveChatroomMembers(
    chatroomId: string,
  ): Promise<ChatroomMemberWithUser[] | null> {
    return this.chatroomMemberRepository.retrieveChatroomMembers(chatroomId);
  }
}

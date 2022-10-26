import { Injectable } from '@nestjs/common';
import { IChatMemberRepository } from './infrastructure/db/chatmember.repository';
import { ChatMember } from './chatmember.domain';

@Injectable()
export class ChatMemberService {
  constructor(private chatMemberRepository: IChatMemberRepository) {}

  async addChatmember(
    chatId: string,
    userId: string,
    isAdminByDefault: boolean = false,
  ): Promise<ChatMember | null> {
    const chatmember = {
      joinedAt: new Date(Date.now()),
      chatId: chatId,
      userId: userId,
      admin: isAdminByDefault,
      muted: false,
      banned: false,
    };
    const ret = await this.chatMemberRepository.add(chatmember);
    return ret ? new ChatMember(ret) : null;
  }
}

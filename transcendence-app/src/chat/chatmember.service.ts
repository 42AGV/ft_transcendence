import { Injectable } from '@nestjs/common';
import { ChatMember } from './chat.domain';
import { IChatMemberRepository } from './infrastructure/db/chatmember.repository';
import { CreateChatMemberDto } from './dto/create-chatmember.dto';

@Injectable()
export class ChatMemberService {
  constructor(private chatMemberRepository: IChatMemberRepository) {}
  async addChatmember(
    createChatMemberDto: CreateChatMemberDto,
    isAdminByDefault: boolean = false,
  ): Promise<ChatMember | null> {
    const chatmember = {
      joinedAt: new Date(Date.now()),
      ...createChatMemberDto,
      admin: isAdminByDefault,
      muted: false,
      banned: false,
    };
    const ret = await this.chatMemberRepository.add(chatmember);
    return ret ? new ChatMember(ret) : null;
  }
}

import { Injectable } from '@nestjs/common';
import { IChatMemberRepository } from './infrastructure/db/chatmember.repository';
import { ChatmemberAsUserResponseDto } from './dto/chatmember.dto';
import { ChatMember } from './infrastructure/db/chatmember.entity';

@Injectable()
export class ChatMemberService {
  constructor(private chatMemberRepository: IChatMemberRepository) {}

  addChatMember(chatId: string, userId: string): Promise<ChatMember | null> {
    const chatMember = {
      joinedAt: new Date(Date.now()),
      chatId: chatId,
      userId: userId,
      admin: false,
      muted: false,
      banned: false,
    };
    return this.chatMemberRepository.add(chatMember);
  }

  async getById(chatId: string, userId: string): Promise<ChatMember | null> {
    const chatMember = await this.chatMemberRepository.getById(chatId, userId);
    return chatMember && !chatMember.banned ? chatMember : null;
  }

  async retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatmemberAsUserResponseDto[] | null> {
    const ret = await this.chatMemberRepository.retrieveChatRoomMembers(
      chatRoomId,
    );

    return (
      ret?.map(
        (chatMember) =>
          new ChatmemberAsUserResponseDto({
            username: chatMember.username,
            avatarId: chatMember.avatarId,
            avatarX: chatMember.avatarX,
            avatarY: chatMember.avatarY,
          }),
      ) ?? null
    );
  }
}

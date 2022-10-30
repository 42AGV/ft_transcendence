import { Injectable } from '@nestjs/common';
import { IChatMemberRepository } from './infrastructure/db/chatmember.repository';
import { ChatMember } from './chatmember.domain';
import { ChatmemberAsUserResponseDto } from './dto/chatmember.dto';

@Injectable()
export class ChatMemberService {
  constructor(private chatMemberRepository: IChatMemberRepository) {}

  async addChatMember(
    chatId: string,
    userId: string,
  ): Promise<ChatMember | null> {
    const chatMember = {
      joinedAt: new Date(Date.now()),
      chatId: chatId,
      userId: userId,
      admin: false,
      muted: false,
      banned: false,
    };
    const ret = await this.chatMemberRepository.add(chatMember);
    return ret ? new ChatMember(ret) : null;
  }

  async retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatmemberAsUserResponseDto[] | null> {
    const ret = await this.chatMemberRepository.retrieveChatRoomMembers(
      chatRoomId,
    );

    return ret
      ? ret.map(
          (chatMember) =>
            new ChatmemberAsUserResponseDto({
              username: chatMember.username,
              avatarId: chatMember.avatarId,
              avatarX: chatMember.avatarX,
              avatarY: chatMember.avatarY,
            }),
        )
      : null;
  }
}

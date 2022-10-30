import { Injectable } from '@nestjs/common';

import { ChatmemberAsUserResponseDto } from '../../dto/chatmember.dto';
import { IChatroomMemberRepository } from './infrastructure/chatroom-member.repository';
import { ChatroomMember } from './chatroom-member.domain';

@Injectable()
export class ChatroomMemberService {
  constructor(private chatMemberRepository: IChatroomMemberRepository) {}

  async addChatMember(
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
    const ret = await this.chatMemberRepository.add(chatmember);
    return ret ? new ChatroomMember(ret) : null;
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

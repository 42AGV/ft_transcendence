import { ChatMemberWithUser } from '../../chatmember.domain';
import { ChatMemberEntity } from './chatmember.entity';

export abstract class IChatMemberRepository {
  abstract add(chatMember: ChatMemberEntity): Promise<ChatMemberEntity | null>;
  abstract getById(
    chatId: string,
    userId: string,
  ): Promise<ChatMemberEntity | null>;
  abstract retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatMemberWithUser[] | null>;
}

import { ChatMember, ChatMemberWithUser } from './chatmember.entity';

export abstract class IChatMemberRepository {
  abstract add(chatMember: ChatMember): Promise<ChatMember | null>;
  abstract getById(chatId: string, userId: string): Promise<ChatMember | null>;
  abstract retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatMemberWithUser[] | null>;
}

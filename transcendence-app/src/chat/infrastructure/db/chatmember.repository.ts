import { ChatMember, ChatMemberWithUser } from '../../chatmember.domain';

export abstract class IChatMemberRepository {
  abstract add(chatMember: ChatMember): Promise<ChatMember | null>;
  abstract retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatMemberWithUser[] | null>;
}

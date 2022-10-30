import { ChatroomMember } from '../chatroom-member.domain';
import { ChatMemberWithUser } from '../chatroom-member.domain';

export abstract class IChatroomMemberRepository {
  abstract add(chatMember: ChatroomMember): Promise<ChatroomMember | null>;
  abstract retrieveChatRoomMembers(
    chatRoomId: string,
  ): Promise<ChatMemberWithUser[] | null>;
}

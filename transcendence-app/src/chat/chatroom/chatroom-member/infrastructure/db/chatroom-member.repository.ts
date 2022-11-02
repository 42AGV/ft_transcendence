import { ChatroomMember } from '../../chatroom-member.domain';
import { ChatroomMemberWithUser } from '../../chatroom-member.domain';

export abstract class IChatroomMemberRepository {
  abstract add(chatroomMember: ChatroomMember): Promise<ChatroomMember | null>;
  abstract retrieveChatroomMembers(
    chatroomId: string,
  ): Promise<ChatroomMemberWithUser[] | null>;
}

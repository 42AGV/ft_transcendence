import { ChatroomMemberWithUser } from '../../chatroom-member.domain';
import { ChatroomMemberEntity } from './chatroom-member.entity';

export abstract class IChatroomMemberRepository {
  abstract add(
    chatroomMember: ChatroomMemberEntity,
  ): Promise<ChatroomMemberEntity | null>;
  abstract getById(
    chatId: string,
    userId: string,
  ): Promise<ChatroomMemberEntity | null>;
  abstract retrieveChatroomMembers(
    chatroomId: string,
  ): Promise<ChatroomMemberWithUser[] | null>;
}

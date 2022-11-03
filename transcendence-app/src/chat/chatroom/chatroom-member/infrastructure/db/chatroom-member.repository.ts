import {
  ChatroomMember,
  ChatroomMemberWithUser,
} from './chatroom-member.entity';

export abstract class IChatroomMemberRepository {
  abstract add(chatroomMember: ChatroomMember): Promise<ChatroomMember | null>;
  abstract getById(
    chatId: string,
    userId: string,
  ): Promise<ChatroomMember | null>;
  abstract retrieveChatroomMembers(
    chatroomId: string,
  ): Promise<ChatroomMemberWithUser[] | null>;
}

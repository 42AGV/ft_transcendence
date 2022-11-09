import {
  ChatroomMember,
  ChatroomMemberWithUser,
} from './chatroom-member.entity';

export abstract class IChatroomMemberRepository {
  abstract addChatroomMember(
    chatroomMember: ChatroomMember,
  ): Promise<ChatroomMember | null>;
  abstract getById(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null>;
  abstract updateById(
    chatroomId: string,
    userId: string,
    chatroomMember: Partial<ChatroomMember>,
  ): Promise<ChatroomMember | null>;
  abstract deleteById(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null>;
  abstract retrieveChatroomMembers(
    chatroomId: string,
  ): Promise<ChatroomMemberWithUser[] | null>;
}

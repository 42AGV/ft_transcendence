import {
  ChatroomMember,
  ChatroomMemberWithUser,
} from './chatroom-member.entity';
import { PaginationWithSearchQueryDto } from '../../../../../shared/dtos/pagination-with-search.query.dto';

export abstract class IChatroomMemberRepository {
  abstract addChatroomMember(
    chatroomMember: ChatroomMember,
  ): Promise<ChatroomMember | null>;
  abstract getById(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null>;
  abstract getByIdWithUser(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMemberWithUser | null>;
  abstract updateById(
    chatroomId: string,
    userId: string,
    chatroomMember: Partial<ChatroomMember>,
  ): Promise<ChatroomMember | null>;
  abstract deleteById(
    chatroomId: string,
    userId: string,
  ): Promise<ChatroomMember | null>;
  abstract getPaginatedChatroomMembers(
    chatroomId: string,
    paginationQueryDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<ChatroomMemberWithUser[] | null>;
}

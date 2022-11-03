import { PaginationQueryDto } from '../../../../../shared/dtos/pagination-query.dto';
import { ChatroomMessageWithUserEntity } from './chatroom-message-with-user.entity';
import { ChatroomMessageEntity } from './chatroom-message.entity';

export abstract class IChatroomMessageRepository {
  abstract add(
    chatRoomMessage: Partial<ChatroomMessageEntity>,
  ): Promise<ChatroomMessageEntity | null>;
  abstract getWithUser(
    chatRoomId: string,
    paginationQueryDto: Required<PaginationQueryDto>,
  ): Promise<ChatroomMessageWithUserEntity[] | null>;
}

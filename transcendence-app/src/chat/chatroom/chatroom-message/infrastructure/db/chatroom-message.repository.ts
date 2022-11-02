import { PaginationQueryDto } from '../../../../../shared/dtos/pagination-query.dto';
import { ChatroomMessageWithUser } from './chatroom-message-with-user.entity';
import { ChatroomMessage } from './chatroom-message.entity';

export abstract class IChatroomMessageRepository {
  abstract add(
    chatRoomMessage: ChatroomMessage,
  ): Promise<ChatroomMessage | null>;
  abstract getWithUser(
    chatRoomId: string,
    paginationQueryDto: Required<PaginationQueryDto>,
  ): Promise<ChatroomMessageWithUser[] | null>;
}

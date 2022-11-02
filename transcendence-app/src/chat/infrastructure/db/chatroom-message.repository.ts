import { PaginationQueryDto } from '../../../shared/dtos/pagination-query.dto';
import { ChatRoomMessageWithUser } from './chat-room-message-with-user.entity';
import { ChatRoomMessage } from './chat-room-message.entity';

export abstract class IChatroomMessageRepository {
  abstract add(
    chatRoomMessage: ChatRoomMessage,
  ): Promise<ChatRoomMessage | null>;
  abstract getWithUser(
    chatRoomId: string,
    paginationQueryDto: Required<PaginationQueryDto>,
  ): Promise<ChatRoomMessageWithUser[] | null>;
}

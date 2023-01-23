import { ChatMessage } from './chat-message.entity';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination.query.dto';
import { ChatMessageWithUser } from './chat-message-with-user.entity';
import { GenericChat } from '../../../infrastructure/generic-chat.entity';

export abstract class IChatMessageRepository {
  abstract add(queryDto: Partial<ChatMessage>): Promise<ChatMessage | null>;
  abstract getPaginatedMessages(
    userMeId: string,
    recipientId: string,
    paginationQueryDto: Required<PaginationQueryDto>,
  ): Promise<ChatMessageWithUser[] | null>;
  abstract getAuthUserChats(
    userMeId: string,
    paginationQueryDto?: Required<PaginationQueryDto>,
  ): Promise<GenericChat[] | null>;
}

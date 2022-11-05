import { ChatMessage } from './chat-message.entity';
import { PaginationQueryDto } from '../../../../shared/dtos/pagination.query.dto';

export abstract class IChatMessageRepository {
  abstract add(queryDto: ChatMessage): Promise<ChatMessage | null>;
  abstract getPaginatedMessages(
    userMeId: string,
    recipientId: string,
    paginationQueryDto: Required<PaginationQueryDto>,
  ): Promise<ChatMessage[] | null>;
}

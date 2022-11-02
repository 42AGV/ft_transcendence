import { ChatMessageEntity } from './chat-message.entity';
import { ChatMessagePaginationQueryDto } from '../../../dto/chat-message.pagination.query.dto';
import { ChatMessageQueryDto } from '../../../dto/chat-message.query.dto';

export abstract class IChatMessageRepository {
  abstract addMessageSet(
    queryDto: ChatMessageQueryDto,
  ): Promise<ChatMessageEntity | null>;
  abstract getPaginatedMessages(
    queryDto: Required<ChatMessagePaginationQueryDto>,
  ): Promise<ChatMessageEntity[] | null>;
}

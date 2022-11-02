import { ChatMessageEntity } from './chat-message.entity';
import { ChatMessagePaginationQueryDto } from '../../../dto/chat-message.pagination.dto';
import { ChatMessageQueryDto } from '../../../dto/chat-message.dto';

export abstract class IChatMessageRepository {
  abstract addMessageSet(
    queryDto: ChatMessageQueryDto,
  ): Promise<ChatMessageEntity | null>;
  abstract getPaginatedMessages(
    queryDto: Required<ChatMessagePaginationQueryDto>,
  ): Promise<ChatMessageEntity[] | null>;
}

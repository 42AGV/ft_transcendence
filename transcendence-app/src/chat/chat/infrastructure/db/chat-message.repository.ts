import { ChatMessageEntity } from './chat-message.entity';

export abstract class IChatMessageRepository {
  abstract add(message: ChatMessageEntity): Promise<ChatMessageEntity | null>;
  // getMessages
}

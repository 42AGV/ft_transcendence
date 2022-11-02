import { ChatMessageEntity } from './infrastructure/db/chat-message.entity';

export class ChatMessage {
  fromId!: string;
  toId!: string;
  content!: string;
  timestamp!: Date;

  constructor(messageEntity: ChatMessageEntity) {
    this.fromId = messageEntity.authorId;
    this.toId = this.getRecipientId(messageEntity);
    this.content = messageEntity.content;
    this.timestamp = messageEntity.createdAt;
  }

  private getRecipientId(messageEntity: ChatMessageEntity) {
    return messageEntity.authorId == messageEntity.user1Id
      ? messageEntity.user1Id
      : messageEntity.user2Id;
  }
}

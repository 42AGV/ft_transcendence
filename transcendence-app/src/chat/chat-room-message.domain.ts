import { ChatRoomMessageEntity } from './infrastructure/db/chat-room-message.entity';

export class ChatRoomMessage {
  id: string;
  userId: string;
  chatId: string;
  content: string;
  createdAt: Date;

  constructor(entity: ChatRoomMessageEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.chatId = entity.chatId;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
  }
}

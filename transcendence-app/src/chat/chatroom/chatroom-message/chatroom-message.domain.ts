import { ChatroomMessageEntity } from './infrastructure/db/chatroom-message.entity';

export class ChatroomMessage {
  id: string;
  userId: string;
  chatId: string;
  content: string;
  createdAt: Date;

  constructor(entity: ChatroomMessageEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.chatId = entity.chatroomId;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
  }
}

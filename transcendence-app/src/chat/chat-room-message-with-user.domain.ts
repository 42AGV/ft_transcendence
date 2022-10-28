import { User } from '../user/user.domain';
import { ChatRoomMessageWithUserEntity } from './infrastructure/db/chat-room-message-with-user.entity';

export class ChatRoomMessageWithUser {
  id: string;
  user: User;
  chatRoomId: string;
  content: string;
  createdAt: Date;

  constructor(entity: ChatRoomMessageWithUserEntity) {
    this.id = entity.id;
    this.user = new User(entity.user);
    this.chatRoomId = entity.chatId;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
  }
}
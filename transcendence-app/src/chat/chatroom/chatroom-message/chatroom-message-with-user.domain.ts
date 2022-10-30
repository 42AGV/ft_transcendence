import { User } from '../../../user/user.domain';
import { ChatroomMessageWithUserEntity } from './infrastructure/chatroom-message-with-user.entity';

export class ChatroomMessageWithUser {
  id: string;
  user: User;
  chatId: string;
  content: string;
  createdAt: Date;

  constructor(entity: ChatroomMessageWithUserEntity) {
    this.id = entity.id;
    this.user = new User(entity.user);
    this.chatId = entity.chatId;
    this.content = entity.content;
    this.createdAt = entity.createdAt;
  }
}

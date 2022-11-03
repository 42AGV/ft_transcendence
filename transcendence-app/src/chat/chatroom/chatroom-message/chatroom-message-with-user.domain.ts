import { User } from '../../../user/user.domain';
import { ChatroomMessage } from './chatroom-message.domain';
import { ChatroomMessageWithUserEntity } from './infrastructure/db/chatroom-message-with-user.entity';

export class ChatroomMessageWithUser extends ChatroomMessage {
  user: User;

  constructor(entity: ChatroomMessageWithUserEntity) {
    super(entity);
    this.user = new User(entity.user);
  }
}

import { User } from '../../../../../user/infrastructure/db/user.entity';
import {
  ChatroomMessage,
  ChatroomMessageData,
} from './chatroom-message.entity';

export interface ChatroomMessageWithUserData extends ChatroomMessageData {
  userUsername: string;
  userEmail: string;
  userFullName: string;
  userPassword: string | null;
  userAvatarId: string;
  userAvatarX: number;
  userAvatarY: number;
  userCreatedAt: Date;
}
export class ChatroomMessageWithUser extends ChatroomMessage {
  user: User;

  constructor(messageData: ChatroomMessageWithUserData) {
    super(messageData);
    this.user = new User({
      id: messageData.userId,
      username: messageData.userUsername,
      email: messageData.userEmail,
      fullName: messageData.userFullName,
      password: messageData.userPassword,
      avatarId: messageData.userAvatarId,
      avatarX: messageData.userAvatarX,
      avatarY: messageData.userAvatarY,
      createdAt: messageData.userCreatedAt,
    });
  }
}

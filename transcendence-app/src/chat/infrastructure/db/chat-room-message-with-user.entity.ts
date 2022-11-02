import { User } from '../../../user/infrastructure/db/user.entity';
import {
  ChatRoomMessage,
  ChatRoomMessageData,
} from './chat-room-message.entity';

export interface ChatRoomMessageWithUserData extends ChatRoomMessageData {
  userUsername: string;
  userEmail: string;
  userFullName: string;
  userPassword: string | null;
  userAvatarId: string | null;
  userAvatarX: number;
  userAvatarY: number;
  userCreatedAt: Date;
}
export class ChatRoomMessageWithUser extends ChatRoomMessage {
  user: User;

  constructor(messageData: ChatRoomMessageWithUserData) {
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

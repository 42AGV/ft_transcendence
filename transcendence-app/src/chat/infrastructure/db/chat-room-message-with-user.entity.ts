import { UserEntity } from '../../../user/infrastructure/db/user.entity';
import {
  ChatRoomMessageEntity,
  ChatRoomMessageEntityData,
} from './chat-room-message.entity';

export interface ChatRoomMessageWithUserEntityData
  extends ChatRoomMessageEntityData {
  userUsername: string;
  userEmail: string;
  userFullName: string;
  userPassword: string | null;
  userAvatarId: string | null;
  userAvatarX: number;
  userAvatarY: number;
  userCreatedAt: Date;
}
export class ChatRoomMessageWithUserEntity extends ChatRoomMessageEntity {
  user: UserEntity;

  constructor(messageData: ChatRoomMessageWithUserEntityData) {
    super(messageData);
    this.user = new UserEntity({
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

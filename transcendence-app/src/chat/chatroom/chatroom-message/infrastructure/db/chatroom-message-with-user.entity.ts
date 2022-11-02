import { UserEntity } from '../../../../../user/infrastructure/db/user.entity';
import {
  ChatroomMessageEntity,
  ChatroomMessageEntityData,
} from './chatroom-message.entity';

export interface ChatroomMessageWithUserEntityData
  extends ChatroomMessageEntityData {
  userUsername: string;
  userEmail: string;
  userFullName: string;
  userPassword: string | null;
  userAvatarId: string | null;
  userAvatarX: number;
  userAvatarY: number;
  userCreatedAt: Date;
}
export class ChatroomMessageWithUserEntity extends ChatroomMessageEntity {
  user: UserEntity;

  constructor(messageData: ChatroomMessageWithUserEntityData) {
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

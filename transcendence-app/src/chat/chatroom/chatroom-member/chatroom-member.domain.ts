/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  ChatroomMemberEntity,
  // cambiar
  ChatMemberWithUserEntity,
} from './infrastructure/chatroom-member.entity';

export class ChatroomMember {
  chatId!: string;
  userId!: string;
  joinedAt!: Date;
  admin: boolean = false;
  muted: boolean = false;
  banned: boolean = false;
  constructor(entity: ChatroomMemberEntity) {
    Object.assign(this, entity);
  }
}

export class ChatMemberWithUser {
  username!: string;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  owner!: boolean;
  admin!: boolean;
  muted!: boolean;
  banned!: boolean;

  constructor(chatMember: ChatMemberWithUserEntity) {
    Object.assign(this, {
      ...chatMember,
    });
  }
}

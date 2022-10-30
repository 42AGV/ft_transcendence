/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  ChatMemberEntity,
  ChatMemberWithUserEntity,
} from './infrastructure/db/chatmember.entity';

export class ChatMember {
  chatId!: string;
  userId!: string;
  joinedAt!: Date;
  admin: boolean = false;
  muted: boolean = false;
  banned: boolean = false;
  constructor(entity: ChatMemberEntity) {
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
      owner: !!chatMember.ownerId,
    });
  }
}

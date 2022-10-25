/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Exclude } from 'class-transformer';
import { ChatEntity } from './infrastructure/db/chat.entity';
import { ChatMemberEntity } from './infrastructure/db/chatmember.entity';

export class Chat {
  id!: string;
  name!: string;
  @Exclude()
  password: string | null | undefined;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  createdAt!: Date;
  ownerId!: string;

  constructor(entity: ChatEntity) {
    Object.assign(this, entity);
  }
}

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

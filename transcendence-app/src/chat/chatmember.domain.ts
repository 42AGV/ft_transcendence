/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ChatMemberEntity } from './infrastructure/db/chatmember.entity';

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

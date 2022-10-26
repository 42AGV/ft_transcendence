import { ChatMemberEntity } from './infrastructure/db/chatmember.entity';

export class ChatMember {
  chatId!: string;
  userId!: string;
  joinedAt!: Date;
  admin = false;
  muted = false;
  banned = false;
  constructor(entity: ChatMemberEntity) {
    Object.assign(this, entity);
  }
}

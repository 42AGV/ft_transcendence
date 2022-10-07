/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Exclude } from 'class-transformer';
import { ChatEntity } from './infrastructure/db/chat.entity';

export class Chat {
  id!: string;
  chatName!: string;
  @Exclude()
  password: string | null | undefined;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  createdAt!: Date;
  owner!: string;

  constructor(entity: ChatEntity) {
    Object.assign(this, entity);
  }
}

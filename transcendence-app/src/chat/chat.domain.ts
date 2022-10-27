/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Exclude } from 'class-transformer';
import { ChatRoomEntity } from './infrastructure/db/chat.entity';

export class ChatRoom {
  id!: string;
  name!: string;
  @Exclude()
  password: string | null | undefined;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  createdAt!: Date;
  ownerId!: string;

  constructor(entity: ChatRoomEntity) {
    Object.assign(this, entity);
  }
}

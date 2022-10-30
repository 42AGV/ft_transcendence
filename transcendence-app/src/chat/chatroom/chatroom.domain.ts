/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Exclude } from 'class-transformer';
import { ChatroomEntity } from './infrastructure/chatroom.entity';

export class Chatroom {
  id!: string;
  name!: string;
  @Exclude()
  password!: string | null;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  createdAt!: Date;
  ownerId!: string;

  constructor(entity: ChatroomEntity) {
    Object.assign(this, entity);
  }
}

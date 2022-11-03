/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Exclude, Expose } from 'class-transformer';

export enum ChatroomKeys {
  ID = '"id"',
  NAME = '"name"',
  PASSWORD = '"password"',
  AVATAR_ID = '"avatarId"',
  CREATED_AT = '"createdAt"',
  AVATAR_X = '"avatarX"',
  AVATAR_Y = '"avatarY"',
  OWNERID = '"ownerId',
}

export interface ChatroomData {
  id: string;
  name: string;
  password: string | null;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  createdAt: Date;
  ownerId: string;
}

export class Chatroom {
  id: string;
  name: string;
  @Exclude()
  password: string | null;
  avatarId: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  createdAt: Date;
  ownerId: string;
  @Expose()
  get public(): boolean {
    return this.password === null;
  }

  constructor(chatroomData: ChatroomData) {
    this.id = chatroomData.id;
    this.name = chatroomData.name;
    this.password = chatroomData.password;
    this.avatarId = chatroomData.avatarId;
    this.avatarX = chatroomData.avatarX;
    this.avatarY = chatroomData.avatarY;
    this.createdAt = chatroomData.createdAt;
    this.ownerId = chatroomData.ownerId;
  }
}

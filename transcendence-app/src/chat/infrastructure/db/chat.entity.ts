import { Exclude, Expose } from 'class-transformer';

export enum chatKeys {
  ID = '"id"',
  NAME = '"name"',
  PASSWORD = '"password"',
  AVATAR_ID = '"avatarId"',
  CREATED_AT = '"createdAt"',
  AVATAR_X = '"avatarX"',
  AVATAR_Y = '"avatarY"',
  OWNERID = '"ownerId',
}

export interface ChatRoomData {
  id: string;
  name: string;
  password: string | null;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  createdAt: Date;
  ownerId: string;
}

export class ChatRoom {
  id: string;
  name: string;
  @Exclude()
  password: string | null;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  createdAt: Date;
  ownerId: string;
  @Expose()
  get public(): boolean {
    return this.password === null;
  }

  constructor(chatroomData: ChatRoomData) {
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

/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export enum userKeys {
  ID = '"id"',
  USERNAME = '"username"',
  EMAIL = '"email"',
  FULL_NAME = '"fullName"',
  PASSWORD = '"password"',
  AVATAR_ID = '"avatarId"',
  CREATED_AT = '"createdAt"',
  AVATAR_X = '"avatarX"',
  AVATAR_Y = '"avatarY"',
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  password: string | null;
  avatarId: string;
  avatarX: number;
  avatarY: number;
  createdAt: Date;
}

export class User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  @ApiHideProperty()
  @Exclude()
  password: string | null;
  avatarId: string;
  avatarX: number = 0;
  avatarY: number = 0;
  createdAt: Date;

  constructor(userData: UserData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.fullName = userData.fullName;
    this.password = userData.password;
    this.avatarId = userData.avatarId;
    this.avatarX = userData.avatarX;
    this.avatarY = userData.avatarY;
    this.createdAt = userData.createdAt;
  }
}

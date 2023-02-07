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
  TWO_FACTOR_AUTHENTICATION_SECRET = '"twoFactorAuthenticationSecret"',
  IS_TWO_FACTOR_AUTHENTICATION_ENABLED = '"isTwoFactorAuthenticationEnabled"',
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
  twoFactorAuthenticationSecret: string | null;
  isTwoFactorAuthenticationEnabled: boolean;
}

export class User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  @ApiHideProperty()
  @Exclude()
  password: string | null;
  isLocal: boolean;
  avatarId: string;
  avatarX: number = 0;
  avatarY: number = 0;
  createdAt: Date;
  @ApiHideProperty()
  @Exclude()
  twoFactorAuthenticationSecret: string | null;
  isTwoFactorAuthenticationEnabled: boolean;

  constructor(userData: UserData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.fullName = userData.fullName;
    this.password = userData.password;
    this.isLocal = this.password !== null;
    this.avatarId = userData.avatarId;
    this.avatarX = userData.avatarX;
    this.avatarY = userData.avatarY;
    this.createdAt = userData.createdAt;
    this.twoFactorAuthenticationSecret = userData.twoFactorAuthenticationSecret;
    this.isTwoFactorAuthenticationEnabled =
      userData.isTwoFactorAuthenticationEnabled;
  }
}

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

type UserEntityData = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  password: string | null;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  createdAt: Date;
};

export class UserEntity {
  id: string;
  username: string;
  email: string;
  fullName: string;
  password: string | null;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  createdAt: Date;

  constructor(userData: UserEntityData) {
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

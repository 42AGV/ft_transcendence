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

export class UserEntity {
  constructor(
    public username: string,
    public email: string,
    public fullName: string,
    public password: string | null,
    public avatarId: string | null,
    public avatarX: number = 0,
    public avatarY: number = 0,
    public id: string,
    public createdAt: Date,
  ) {}
}

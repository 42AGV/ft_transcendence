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

export class ChatEntity {
  constructor(
    public id: string,
    public name: string,
    public password: string | null | undefined,
    public avatarId: string | null,
    public avatarX: number = 0,
    public avatarY: number = 0,
    public createdAt: Date,
    public ownerId: string,
  ) {}
}

export enum chatKeys {
  ID = '"id"',
  CHATNAME = '"chatName"',
  PASSWORD = '"password"',
  AVATAR_ID = '"avatarId"',
  CREATED_AT = '"createdAt"',
  AVATAR_X = '"avatarX"',
  AVATAR_Y = '"avatarY"',
  OWNER = '"owner',
}

export class ChatEntity {
  constructor(
    public id: string,
    public chatName: string,
    public password: string | null | undefined,
    public avatarId: string | null,
    public avatarX: number = 0,
    public avatarY: number = 0,
    public createdAt: Date,
    public owner: string,
  ) {}
}

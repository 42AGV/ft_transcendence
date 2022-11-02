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

export class ChatroomEntity {
  constructor(
    public id: string,
    public name: string,
    public password: string | null,
    public avatarId: string | null,
    public avatarX: number = 0,
    public avatarY: number = 0,
    public createdAt: Date,
    public ownerId: string,
  ) {}
}
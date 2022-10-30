export enum ChatroomMemberKeys {
  CHATID = '"chatId"',
  USERID = '"userId"',
  JOINED_AT = '"joinedAt"',
  ADMIN = '"admin"',
  MUTED = '"muted"',
  BANNED = '"banned"',
}

export class ChatroomMemberEntity {
  constructor(
    public chatId: string,
    public userId: string,
    public joinedAt: Date,
    public admin: boolean = false,
    public muted: boolean = false,
    public banned: boolean = false,
  ) {}
}

export class ChatMemberWithUserEntity {
  username!: string;
  avatarId!: string | null;
  avatarX: number = 0;
  avatarY: number = 0;
  owner!: boolean;
  admin!: boolean;
  muted!: boolean;
  banned!: boolean;
}

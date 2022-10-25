export enum chatMembersKeys {
  CHATID = '"chatId"',
  USERID = '"userId"',
  JOINED_AT = '"joinedAt"',
  ADMIN = '"admin"',
  MUTED = '"muted"',
  BANNED = '"banned"',
}

export class ChatMemberEntity {
  constructor(
    public chatId: string,
    public userId: string,
    public joinedAt: Date,
    public admin: boolean = false,
    public muted: boolean = false,
    public banned: boolean = false,
  ) {}
}

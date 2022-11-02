export enum chatMembersKeys {
  CHATID = '"chatId"',
  USERID = '"userId"',
  JOINED_AT = '"joinedAt"',
  ADMIN = '"admin"',
  MUTED = '"muted"',
  BANNED = '"banned"',
}

export interface ChatMemberData {
  chatId: string;
  userId: string;
  joinedAt: Date;
  admin: boolean;
  muted: boolean;
  banned: boolean;
}

export class ChatMember {
  chatId: string;
  userId: string;
  joinedAt: Date;
  admin: boolean;
  muted: boolean;
  banned: boolean;

  constructor(chatMemberData: ChatMemberData) {
    this.chatId = chatMemberData.chatId;
    this.userId = chatMemberData.userId;
    this.joinedAt = chatMemberData.joinedAt;
    this.admin = chatMemberData.admin;
    this.muted = chatMemberData.muted;
    this.banned = chatMemberData.banned;
  }
}

export interface ChatMemberWithUserData {
  username: string;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  owner: boolean;
  admin: boolean;
  muted: boolean;
  banned: boolean;
}

export class ChatMemberWithUser {
  username: string;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  owner: boolean;
  admin: boolean;
  muted: boolean;
  banned: boolean;

  constructor(chatMemberWithUserData: ChatMemberWithUserData) {
    this.username = chatMemberWithUserData.username;
    this.avatarId = chatMemberWithUserData.avatarId;
    this.avatarX = chatMemberWithUserData.avatarX;
    this.avatarY = chatMemberWithUserData.avatarY;
    this.owner = chatMemberWithUserData.owner;
    this.admin = chatMemberWithUserData.admin;
    this.muted = chatMemberWithUserData.muted;
    this.banned = chatMemberWithUserData.banned;
  }
}

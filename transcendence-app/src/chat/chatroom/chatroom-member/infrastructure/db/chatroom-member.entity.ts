export enum ChatroomMemberKeys {
  CHATID = '"chatId"',
  USERID = '"userId"',
  JOINED_AT = '"joinedAt"',
  ADMIN = '"admin"',
  MUTED = '"muted"',
  BANNED = '"banned"',
}

export interface ChatroomMemberData {
  chatId: string;
  userId: string;
  joinedAt: Date;
  admin: boolean;
  muted: boolean;
  banned: boolean;
}

export class ChatroomMember {
  chatId: string;
  userId: string;
  joinedAt: Date;
  admin: boolean;
  muted: boolean;
  banned: boolean;

  constructor(chatroomMemberData: ChatroomMemberData) {
    this.chatId = chatroomMemberData.chatId;
    this.userId = chatroomMemberData.userId;
    this.joinedAt = chatroomMemberData.joinedAt;
    this.admin = chatroomMemberData.admin;
    this.muted = chatroomMemberData.muted;
    this.banned = chatroomMemberData.banned;
  }
}

export interface ChatroomMemberWithUserData {
  username: string;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  owner: boolean;
  admin: boolean;
  muted: boolean;
  banned: boolean;
}

export class ChatroomMemberWithUser {
  username: string;
  avatarId: string | null;
  avatarX: number;
  avatarY: number;
  owner: boolean;
  admin: boolean;
  muted: boolean;
  banned: boolean;

  constructor(chatroomMemberWithUserData: ChatroomMemberWithUserData) {
    this.username = chatroomMemberWithUserData.username;
    this.avatarId = chatroomMemberWithUserData.avatarId;
    this.avatarX = chatroomMemberWithUserData.avatarX;
    this.avatarY = chatroomMemberWithUserData.avatarY;
    this.owner = chatroomMemberWithUserData.owner;
    this.admin = chatroomMemberWithUserData.admin;
    this.muted = chatroomMemberWithUserData.muted;
    this.banned = chatroomMemberWithUserData.banned;
  }
}

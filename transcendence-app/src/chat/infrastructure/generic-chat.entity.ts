export enum ChatType {
  ONE_TO_ONE = 'oneToOne',
  CHATROOM = 'chatroom',
}

export interface GenericChatData {
  avatarId: string;
  avatarX: number;
  avatarY: number;
  rtti: ChatType;
  name: string;
  id: string;
  chatCreationDate: Date | null;
  isPublic: boolean | null;
  lastMsgSenderUsername: string | null;
  lastMessage: string | null;
  lastMessageDate: Date;
}

export class GenericChat {
  avatarId: string;
  avatarX: number;
  avatarY: number;
  rtti: ChatType;
  name: string;
  id: string;
  isPublic: boolean | null;
  lastMsgSenderUsername: string | null;
  lastMessage: string | null;
  lastMessageDate: Date;

  constructor(chatData: GenericChatData) {
    this.avatarId = chatData.avatarId;
    this.avatarX = chatData.avatarX;
    this.avatarY = chatData.avatarY;
    this.rtti = chatData.rtti;
    this.id = chatData.id;
    this.isPublic = chatData.isPublic;
    this.name = chatData.name;
    this.lastMsgSenderUsername = chatData.lastMsgSenderUsername;
    this.lastMessage = chatData.lastMessage;
    this.lastMessageDate = chatData.lastMessageDate;
  }
}

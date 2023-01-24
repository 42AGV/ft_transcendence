export interface GenericChatData {
  avatarId: string;
  avatarX: number;
  avatarY: number;
  url: string;
  name: string;
  id: string;
  lastMsgSenderUsername: string;
  lastMessage: string;
  lastMessageDate: Date;
}

export class GenericChat {
  avatarId: string;
  avatarX: number;
  avatarY: number;
  url: string;
  name: string;
  id: string;
  lastMsgSenderUsername: string;
  lastMessage: string;
  lastMessageDate: Date;

  constructor(chatData: GenericChatData) {
    this.avatarId = chatData.avatarId;
    this.avatarX = chatData.avatarX;
    this.avatarY = chatData.avatarY;
    this.url = chatData.url;
    this.id = chatData.id;
    this.name = chatData.name;
    this.lastMsgSenderUsername = chatData.lastMsgSenderUsername;
    this.lastMessage = chatData.lastMessage;
    this.lastMessageDate = chatData.lastMessageDate;
  }
}

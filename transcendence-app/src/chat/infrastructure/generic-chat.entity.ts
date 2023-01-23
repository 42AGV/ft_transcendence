export interface GenericChatData {
  avatarId: string | null;
  avatarX: number | null;
  avatarY: number | null;
  url: string;
  name: string;
  lastMessage?: string;
  lastMessageDate?: Date;
}

export class GenericChat {
  avatarId: string | null;
  avatarX: number | null;
  avatarY: number | null;
  url: string;
  name: string;
  lastMessage: string | undefined;
  lastMessageDate: Date | undefined;

  constructor(chatData: GenericChatData) {
    this.avatarId = chatData.avatarId;
    this.avatarX = chatData.avatarX;
    this.avatarY = chatData.avatarY;
    this.url = chatData.url;
    this.name = chatData.name;
    this.lastMessage = chatData?.lastMessage;
    this.lastMessageDate = chatData?.lastMessageDate;
  }
}

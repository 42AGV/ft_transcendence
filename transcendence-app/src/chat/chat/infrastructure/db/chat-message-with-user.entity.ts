export enum chatMessageKeys {
  ID = '"id"',
  SENDER_ID = '"senderId"',
  RECIPIENT_ID = '"senderId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export class ChatMessageWithUser {
  id: string;
  avatarId: string;
  avatarX: number;
  avatarY: number;
  username: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: Date;
  constructor(chatMessage: ChatMessageWithUser) {
    this.id = chatMessage.id;
    this.avatarId = chatMessage.avatarId;
    this.avatarX = chatMessage.avatarX;
    this.avatarY = chatMessage.avatarY;
    this.username = chatMessage.username;
    this.recipientId = chatMessage.recipientId;
    this.senderId = chatMessage.senderId;
    this.content = chatMessage.content;
    this.createdAt = chatMessage.createdAt;
  }
}

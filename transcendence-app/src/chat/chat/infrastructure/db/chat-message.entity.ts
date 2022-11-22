export enum chatMessageKeys {
  ID = '"id"',
  SENDER_ID = '"senderId"',
  RECIPIENT_ID = '"senderId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export class ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: Date;
  constructor(chatMessage: ChatMessage) {
    this.id = chatMessage.id;
    this.senderId = chatMessage.senderId;
    this.recipientId = chatMessage.recipientId;
    this.content = chatMessage.content;
    this.createdAt = chatMessage.createdAt;
  }
}

export enum chatMessageKeys {
  ID = '"id"',
  USER_ID = '"userId"',
  CHAT_ID = '"chatId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export class ChatMessageEntity {
  constructor(
    public senderId: string,
    public recipientId: string,
    public sendedAt: Date,
    public message: string,
  ) {}
}

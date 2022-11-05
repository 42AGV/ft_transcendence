export enum chatMessageKeys {
  ID = '"id"',
  SENDER_ID = '"senderId"',
  RECIPIENT_ID = '"senderId"',
  CONTENT = '"content"',
  CREATED_AT = '"createdAt"',
}

export class ChatMessage {
  constructor(
    public id: string,
    public senderId: string,
    public recipientId: string,
    public content: string,
    public createdAt: Date,
  ) {}
}

export enum chatMessageKeys {
  ID = '"id"',
  AUTHOR_ID = '"authorId"',
  CONTENT = '"chatId"',
  CREATED_AT = '"createdAt"',
  USER_1_ID = '"user1Id"',
  USER_2_ID = '"user2Id"',
}

export class ChatMessageEntity {
  constructor(
    public id: string,
    public authorId: string,
    public content: string,
    public createdAt: Date,
    public user1Id: string,
    public user2Id: string,
  ) {}
}

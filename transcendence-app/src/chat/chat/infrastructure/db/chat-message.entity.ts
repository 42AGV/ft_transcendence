export enum chatMessageKeys {
  ID = '"id"',
  AUTHOR_ID = '"authorId"',
  CONTENT = '"chatId"',
  CREATED_AT = '"createdAt"',
  AUTHOR_1_ID = '"author1Id"',
  AUTHOR_2_ID = '"author2Id"',
}

export class ChatMessageEntity {
  constructor(
    public id: string,
    public authorId: string,
    public content: string,
    public createdAt: Date,
    public author1Id: string,
    public author2Id: string,
  ) {}
}

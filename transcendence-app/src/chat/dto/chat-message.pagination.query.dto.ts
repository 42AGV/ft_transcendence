export class ChatMessagePaginationQueryDto {
  limit?: number;
  offset?: number;
  user1Id!: string;
  user2Id!: string;
}

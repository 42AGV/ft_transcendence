import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class ChatMessageQueryDto {
  @IsUUID()
  authorId!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsUUID()
  user1Id!: string;

  @IsUUID()
  user2Id!: string;
}

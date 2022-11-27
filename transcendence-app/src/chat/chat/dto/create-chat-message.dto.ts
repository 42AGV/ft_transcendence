import { IsString, IsUUID } from 'class-validator';

export class CreateChatMessageDto {
  @IsUUID()
  userId!: string;

  @IsString()
  content!: string;
}

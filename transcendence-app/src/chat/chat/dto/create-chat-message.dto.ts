import { IsString, IsUUID } from 'class-validator';

export class CreateChatMessageDto {
  @IsUUID()
  id!: string;

  @IsString()
  content!: string;
}

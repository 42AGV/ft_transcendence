import { IsString, IsUUID } from 'class-validator';

export class CreateChatroomMessageDto {
  @IsUUID()
  id!: string;

  @IsString()
  content!: string;
}

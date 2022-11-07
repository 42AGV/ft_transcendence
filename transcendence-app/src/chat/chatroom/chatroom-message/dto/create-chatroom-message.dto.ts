import { IsString, IsUUID } from 'class-validator';

export class CreateChatroomMessageDto {
  @IsUUID()
  chatroomId!: string;

  @IsString()
  content!: string;
}

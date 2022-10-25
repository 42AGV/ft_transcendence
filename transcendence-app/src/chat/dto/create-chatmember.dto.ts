import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMemberDto {
  @IsString()
  @IsNotEmpty()
  chatId!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;
}

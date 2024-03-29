import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinChatroomDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}

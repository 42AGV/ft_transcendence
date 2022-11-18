import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChatroomMemberDto {
  @IsBoolean()
  @IsOptional()
  admin?: boolean;

  @IsBoolean()
  @IsOptional()
  muted?: boolean;

  @IsBoolean()
  @IsOptional()
  banned?: boolean;
}

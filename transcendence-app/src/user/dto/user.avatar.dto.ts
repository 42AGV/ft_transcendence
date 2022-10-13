import { StreamableFile } from '@nestjs/common';
import { IsNotEmpty, IsUUID, ValidateIf } from 'class-validator';

export class UserAvatarDto {
  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  avatarId!: string;

  @IsNotEmpty()
  file!: StreamableFile;
}

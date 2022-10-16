import { StreamableFile } from '@nestjs/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserAvatarDto {
  @IsUUID()
  avatarId!: string;

  @IsNotEmpty()
  file!: StreamableFile;
}

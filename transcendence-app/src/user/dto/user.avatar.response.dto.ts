import { StreamableFile } from '@nestjs/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserAvatarResponseDto {
  @IsUUID()
  avatarId!: string;

  @IsNotEmpty()
  file!: StreamableFile;
}

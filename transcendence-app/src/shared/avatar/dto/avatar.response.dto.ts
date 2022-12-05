import { StreamableFile } from '@nestjs/common';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AvatarResponseDto {
  @IsUUID()
  avatarId!: string;

  @IsNotEmpty()
  file!: StreamableFile;
}

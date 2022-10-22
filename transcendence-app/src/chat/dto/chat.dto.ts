import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateIf } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  chatName!: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  password!: string | null;

  @IsUUID()
  avatarId!: string | null;

  @IsUUID()
  owner!: string;
}

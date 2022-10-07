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
  @ValidateIf((object, value) => value !== null)
  avatarId!: string | null;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  owner!: string;
}

import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  chatName!: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  password!: string | null;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  confirmationPassword!: string | null;
}

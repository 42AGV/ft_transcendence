import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateChatroomDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  password!: string | null;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  confirmationPassword!: string | null;

  @IsInt()
  @IsOptional()
  avatarX?: number;

  @IsInt()
  @IsOptional()
  avatarY?: number;
}

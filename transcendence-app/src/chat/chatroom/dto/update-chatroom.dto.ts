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
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  oldPassword?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  password?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  confirmationPassword?: string | null;

  @IsInt()
  @IsOptional()
  avatarX?: number;

  @IsInt()
  @IsOptional()
  avatarY?: number;
}

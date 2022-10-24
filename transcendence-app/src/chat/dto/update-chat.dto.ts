import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateChatDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  avatarX?: number;

  @IsInt()
  @IsOptional()
  avatarY?: number;
}

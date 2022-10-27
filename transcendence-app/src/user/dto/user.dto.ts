/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object, value) => value !== null)
  password!: string | null;

  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  avatarId!: string | null;
}

export class UserDto {
  username!: string;
  email!: string;
  fullName!: string;
  avatarId!: string | null;
  avatarX!: number;
  avatarY!: number;
  id!: string;
  createdAt!: Date;
  isBlocked?: boolean | null;
}

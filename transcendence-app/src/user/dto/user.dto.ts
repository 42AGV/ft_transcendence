import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  avatarId!: string | null;
}

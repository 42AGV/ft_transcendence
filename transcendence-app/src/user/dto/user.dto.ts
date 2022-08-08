import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsUrl()
  @ValidateIf((object, value) => value !== null)
  avatar!: string | null;
}

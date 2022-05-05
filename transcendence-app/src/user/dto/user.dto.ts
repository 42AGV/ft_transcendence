import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsUrl()
  image_url!: string;
}

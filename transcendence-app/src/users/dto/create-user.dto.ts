import { IsEmail, IsNotEmpty, IsNumber, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  provider: string;

  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsUrl()
  image_url: string;

  @IsNumber()
  externalProviderId: number;
}

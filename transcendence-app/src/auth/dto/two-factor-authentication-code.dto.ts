import { IsNumberString } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
  @IsNumberString()
  twoFactorAuthenticationCode!: string;
}

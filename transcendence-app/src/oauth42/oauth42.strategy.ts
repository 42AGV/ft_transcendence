import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { Api42Service } from '../user/api42.service';
import { UserDto } from '../user/dto/user.dto';
import { OAuth42Config } from './oauth42-config.interface';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, 'oauth42') {
  constructor(
    private api42Service: Api42Service,
    protected configService: ConfigService<OAuth42Config>,
  ) {
    super({
      authorizationURL: configService.get('FORTYTWO_APP_AUTHORIZATION_URL'),
      tokenURL: configService.get('FORTYTWO_APP_TOKEN_URL'),
      clientID: configService.get('FORTYTWO_APP_ID'),
      clientSecret: configService.get('FORTYTWO_APP_SECRET'),
      callbackURL: configService.get('FORTYTWO_APP_CALLBACK_URL'),
      scope: ['public'],
    });
  }

  validate(accessToken: string): Promise<UserDto> {
    return this.api42Service.get42UserData(accessToken);
  }
}

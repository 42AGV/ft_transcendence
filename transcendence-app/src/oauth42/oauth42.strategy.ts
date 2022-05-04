import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { OAuth42Config } from './oauth42-config.interface';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, 'oauth42') {
  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    protected configService: ConfigService<OAuth42Config>,
  ) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: configService.get('FORTYTWO_APP_ID'),
      clientSecret: configService.get('FORTYTWO_APP_SECRET'),
      callbackURL: configService.get('FORTYTWO_APP_CALLBACK_URL'),
      scope: ['public'],
    });
  }

  private async validateFortyTwoResponse(user: CreateUserDto) {
    const validatedUser = plainToClass(CreateUserDto, user);
    const errors = await validate(validatedUser, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedUser;
  }

  async validate(accessToken: string) {
    const { data } = await lastValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ).catch((err) => {
      console.error(err.message);
      throw new BadGatewayException();
    });

    const user: CreateUserDto = {
      provider: '42',
      externalProviderId: Number.parseInt(data.id),
      image_url: data.image_url,
      username: data.login,
      email: data.email,
    };

    try {
      const validatedUser = await this.validateFortyTwoResponse(user);
      return this.usersService.findOneOrCreate(validatedUser);
    } catch (err) {
      console.error(err.message);
      throw new BadGatewayException();
    }
  }
}

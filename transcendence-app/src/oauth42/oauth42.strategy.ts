import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { OAuth42Config } from './oauth42-config.interface';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, 'oauth42') {
  private readonly logger = new Logger(OAuth42Strategy.name);

  constructor(
    private userService: UserService,
    private httpService: HttpService,
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
    const profileUrl = this.configService.get('FORTYTWO_APP_PROFILE_URL');
    const { data } = await lastValueFrom(
      this.httpService.get(profileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ).catch((err) => {
      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.error(err.message);
      }
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
      return this.userService.findOneOrCreate(validatedUser);
    } catch (err) {
      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.error(err.message);
      }
      throw new BadGatewayException();
    }
  }
}

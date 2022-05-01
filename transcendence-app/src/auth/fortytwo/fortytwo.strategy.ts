import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersService } from '../../users/users.service';
import { FortyTwoAuthConfig } from './fortytwo-config.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    private configService: ConfigService<FortyTwoAuthConfig>,
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

  validateApiResponse(
    user: CreateUserDto,
    createUserDtoClass: ClassConstructor<any>,
  ) {
    const validatedUser = plainToClass(createUserDtoClass, user, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedUser, {
      skipMissingProperties: false,
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
      const validatedUserDto = this.validateApiResponse(user, CreateUserDto);
      return this.usersService.findOrCreateUser(validatedUserDto);
    } catch (err) {
      console.error(err.message);
      throw new BadGatewayException();
    }
  }
}

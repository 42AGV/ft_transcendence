import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { lastValueFrom } from 'rxjs';
import { OAuth42Config } from '../auth/oauth42-config.interface';
import { UserDto } from './dto/user.dto';

@Injectable()
export class Api42Service {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService<OAuth42Config>,
  ) {}

  private async fetch42UserData(accessToken: string): Promise<any> {
    const profileUrl = this.configService.get('FORTYTWO_APP_PROFILE_URL');
    const { data } = await lastValueFrom(
      this.httpService.get(profileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );

    return data;
  }

  private static async validate42ApiResponse(user: UserDto): Promise<UserDto> {
    const validatedUser = plainToClass(UserDto, user);
    const errors = await validate(validatedUser, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedUser;
  }

  async get42UserData(accessToken: string): Promise<UserDto> {
    const data = await this.fetch42UserData(accessToken);
    const user: UserDto = {
      avatar: data.image_url,
      username: data.login,
      email: data.email,
    };

    return Api42Service.validate42ApiResponse(user);
  }
}

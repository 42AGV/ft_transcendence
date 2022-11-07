import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { lastValueFrom } from 'rxjs';
import { OAuth42Config } from '../auth/oauth42-config.interface';
import { CreateUserDto } from './dto/create-user.dto';

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

  downloadUserAvatar(accessToken: string, url: string) {
    return lastValueFrom(
      this.httpService.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'stream',
      }),
    );
  }

  private static async validate42ApiResponse(
    user: CreateUserDto,
  ): Promise<CreateUserDto> {
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

  async get42UserData(accessToken: string): Promise<{
    userDto: CreateUserDto;
    avatarUrl: string;
    providerId: string;
  }> {
    const data = await this.fetch42UserData(accessToken);
    const userDto: CreateUserDto = {
      username: data.login,
      email: data.email,
      fullName: data.usual_full_name,
      password: null,
    };

    await Api42Service.validate42ApiResponse(userDto);
    return { userDto, avatarUrl: data.image.link, providerId: data.id };
  }
}

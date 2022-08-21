import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-oauth2';
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { LocalFileService } from '../shared/local-file/local-file.service';
import { Api42Service } from '../user/api42.service';
import { AVATARS_PATH } from '../user/constants';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/user.domain';
import { UserService } from '../user/user.service';
import { OAuth42Config } from './oauth42-config.interface';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, 'oauth42') {
  constructor(
    private api42Service: Api42Service,
    private userService: UserService,
    private localFileService: LocalFileService,
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

  authenticate(req: Request, options?: any) {
    options.state = req.query.state;
    super.authenticate(req, options);
  }

  private async saveAvatar(
    accessToken: string,
    avatarUrl: string,
  ): Promise<LocalFileDto> {
    const response = await this.api42Service.downloadUserAvatar(
      accessToken,
      avatarUrl,
    );
    return this.localFileService.saveFileData(
      response.data,
      AVATARS_PATH,
      response.headers['content-type'],
    );
  }

  private async createUser(
    fileDto: LocalFileDto,
    userDto: UserDto,
  ): Promise<User | null> {
    const user = await this.userService.addAvatarAndUser(fileDto, userDto);
    if (!user) {
      this.localFileService.deleteFileData(fileDto.path);
    }
    return user;
  }

  async validate(accessToken: string): Promise<User | null> {
    const { userDto, avatarUrl } = await this.api42Service.get42UserData(
      accessToken,
    );
    const dbUser = await this.userService.retrieveUserWithUserName(
      userDto.username,
    );
    if (dbUser) {
      return dbUser;
    }

    const avatarDto = await this.saveAvatar(accessToken, avatarUrl);
    return this.createUser(avatarDto, userDto);
  }
}

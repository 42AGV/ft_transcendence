import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { v4 as uuidv4 } from 'uuid';
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { LocalFileService } from '../shared/local-file/local-file.service';
import { Api42Service } from '../user/api42.service';
import { AVATARS_PATH } from '../shared/constants';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/infrastructure/db/user.entity';
import { UserService } from '../user/user.service';
import {
  AuthProviderService,
  AuthProviderType,
} from './auth-provider/auth-provider.service';
import { OAuth42Config } from './oauth42-config.interface';

@Injectable()
export class OAuth42Strategy extends PassportStrategy(Strategy, 'oauth42') {
  constructor(
    private api42Service: Api42Service,
    private userService: UserService,
    private localFileService: LocalFileService,
    private authProviderService: AuthProviderService,
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

  private async saveAvatar(
    accessToken: string,
    avatarUrl: string,
  ): Promise<LocalFileDto> {
    const response = await this.api42Service.downloadUserAvatar(
      accessToken,
      avatarUrl,
    );
    return this.localFileService.saveFileDataFromStream(
      response.data,
      AVATARS_PATH,
      response.headers['content-type'],
    );
  }

  private async generateRandomUsername(
    username: string,
  ): Promise<string | null> {
    let maxTries = 10;
    const maxUsernameLength = 20;

    while (maxTries > 0) {
      const randomToken = Math.random().toString(36).slice(2);
      const randomUsername =
        username.slice(0, maxUsernameLength - randomToken.length) + randomToken;
      const user = await this.userService.retrieveUserWithUserName(
        randomUsername,
      );
      if (user === null) {
        return randomUsername;
      }
      maxTries--;
    }

    return null;
  }

  private async createUser(
    avatarDto: LocalFileDto,
    userDto: CreateUserDto,
  ): Promise<User | null> {
    const userWithUsernameExists =
      await this.userService.retrieveUserWithUserName(userDto.username);
    if (userWithUsernameExists) {
      const username = await this.generateRandomUsername(userDto.username);
      if (!username) {
        return null;
      }
      userDto.username = username;
    }
    const avatarId = uuidv4();
    const user = await this.userService.addAvatarAndUser(
      avatarId,
      avatarDto,
      userDto,
    );
    if (!user) {
      this.localFileService.deleteFileData(avatarDto.path);
    }
    return user;
  }

  async validate(accessToken: string): Promise<User | null> {
    const { userDto, avatarUrl, providerId } =
      await this.api42Service.get42UserData(accessToken);
    const dbUser = await this.userService.retrieveUserWithAuthProvider(
      AuthProviderType.FortyTwo,
      providerId,
    );
    if (dbUser) {
      return dbUser;
    }

    const avatarDto = await this.saveAvatar(accessToken, avatarUrl);
    const user = await this.createUser(avatarDto, userDto);
    if (user) {
      await this.authProviderService.addProvider({
        provider: AuthProviderType.FortyTwo,
        providerId,
        userId: user.id,
      });
    }
    return user;
  }
}

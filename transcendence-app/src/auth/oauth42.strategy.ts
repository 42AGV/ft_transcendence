import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
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

  async validate(accessToken: string): Promise<User | null> {
    // fetch and validate the user data from the 42 API
    const userData = await this.api42Service.fetch42UserData(accessToken);
    const apiUser: UserDto = {
      avatar_id: null,
      username: userData.login,
      email: userData.email,
    };

    await Api42Service.validate42ApiResponse(apiUser);

    // check if the user is already in the database
    const dbUser = await this.userService.retrieveUserWithUserName(
      apiUser.username,
    );

    if (dbUser) {
      return dbUser;
    }

    // download the avatar and save the user in database
    const response = await this.api42Service.downloadUserAvatar(
      accessToken,
      userData.image_url,
    );
    const fileDto = await this.localFileService.saveFileData(
      response.data,
      AVATARS_PATH,
      response.headers['content-type'],
    );
    const file = await this.localFileService.saveFile(fileDto);

    if (file) {
      apiUser.avatar_id = file.id;
    } else {
      this.localFileService.deleteFileData(fileDto.path);
    }
    return this.userService.addUser(apiUser);
  }
}

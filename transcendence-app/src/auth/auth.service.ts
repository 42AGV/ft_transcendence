import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
// TODO investigate why this works
import generateAvatar = require('github-like-avatar-generator');
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { User } from '../user/user.domain';
import { UserService } from '../user/user.service';
import { LocalFileService } from 'src/shared/local-file/local-file.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  readonly saltLength = 8;
  readonly hashLength = 32;

  constructor(
    private readonly userService: UserService,
    private readonly localFileService: LocalFileService,
  ) {}

  async validateUser(user: LoginUserDto): Promise<User> {
    const foundUser = await this.userService.retrieveUserWithUserName(
      user.username,
    );
    const incorrectCredentialsException = new ForbiddenException(
      'Incorrect username or password',
    );

    if (!foundUser || !foundUser.password) {
      throw incorrectCredentialsException;
    }

    const [salt, storedHash] = foundUser.password.split('.');
    const hash = (await scrypt(user.password, salt, this.hashLength)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw incorrectCredentialsException;
    }

    return foundUser;
  }

  async registerLocalUser(user: RegisterUserDto): Promise<User | null> {
    const existingUser = await this.userService.retrieveUserWithUserName(
      user.username,
    );

    if (existingUser) {
      throw new UnprocessableEntityException('Username already exists');
    }

    if (user.password !== user.confirmationPassword) {
      throw new BadRequestException(
        'Password and Confirmation Password must match',
      );
    }

    const salt = randomBytes(this.saltLength).toString('hex');
    const hash = (await scrypt(user.password, salt, this.hashLength)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const { confirmationPassword: _, ...newUser } = user;
    console.log(typeof generateAvatar);
    const newAvatar = generateAvatar({
      blocks: 6,
      width: 100,
    });

    console.dir(newAvatar);

    return this.userService.addUser({
      ...newUser,
      avatarId: null,
      password: result,
    });
  }
}

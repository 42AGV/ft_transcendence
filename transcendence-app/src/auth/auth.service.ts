import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { User } from '../user/user.domain';
import { UserService } from '../user/user.service';
import { IUserRepository } from 'src/user/infrastructure/db/user.repository';
import { LocalFileService } from '../shared/local-file/local-file.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  readonly saltLength = 8;
  readonly hashLength = 32;

  constructor(
    private userRepository: IUserRepository,
    private readonly userService: UserService,
    private readonly localFileService: LocalFileService,
  ) {}

  async validateUser(user: LoginUserDto): Promise<User> {
    const foundUser = await this.userRepository.getByUsername(user.username);
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
    const existingUser = await this.userRepository.getByUsername(user.username);

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

    const avatarDto = await this.localFileService.createRandomSVGFile(12, 512);
    const avatarId = uuidv4();
    const userDto = {
      ...newUser,
      avatarId,
      password: result,
    };

    return this.userService.addAvatarAndUser(avatarId, avatarDto, userDto);
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { User } from '../user/user.domain';
import { UserService } from '../user/user.service';
import { IUserRepository } from '../user/infrastructure/db/user.repository';
import { LocalFileService } from '../shared/local-file/local-file.service';
import { Password } from '../shared/password';

@Injectable()
export class AuthService {
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

    if ((await Password.compare(foundUser.password, user.password)) === false) {
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

    const hashedPassword = await Password.toHash(user.password);
    const { confirmationPassword: _, ...newUser } = user;

    const avatarDto = await this.localFileService.createRandomSVGFile(12, 512);
    const avatarId = uuidv4();
    const userDto = {
      ...newUser,
      avatarId,
      password: hashedPassword,
    };

    return this.userService.addAvatarAndUser(avatarId, avatarDto, userDto);
  }
}

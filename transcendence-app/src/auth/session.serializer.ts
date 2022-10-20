import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../user/infrastructure/db/user.entity';
import { User } from '../user/user.domain';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: UserEntity, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.userService.retrieveUserWithId(userId);
    done(null, plainToInstance(User, user));
  }
}

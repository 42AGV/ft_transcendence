import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { instanceToPlain } from 'class-transformer';
import { User } from '../user/infrastructure/db/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.userService.retrieveUserWithId(userId);
    done(null, instanceToPlain(user));
  }
}

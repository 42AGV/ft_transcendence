import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: UserEntity, done: CallableFunction) {
    done(null, user.id);
  }

  deserializeUser(userId: number, done: CallableFunction) {
    const user = this.userService.retrieveUserWithId(userId);
    done(null, user);
  }
}

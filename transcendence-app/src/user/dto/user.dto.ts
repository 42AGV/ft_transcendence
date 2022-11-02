import { User } from '../infrastructure/db/user.entity';

export class UserDto extends User {
  isBlocked: boolean | null;

  constructor(userEntity: User, isBlocked: boolean | null) {
    super(userEntity);
    this.isBlocked = isBlocked;
  }
}

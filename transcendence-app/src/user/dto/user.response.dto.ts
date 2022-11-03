import { User } from '../infrastructure/db/user.entity';

export class UserResponseDto extends User {
  isBlocked: boolean | null;

  constructor(userEntity: User, isBlocked: boolean | null) {
    super(userEntity);
    this.isBlocked = isBlocked;
  }
}

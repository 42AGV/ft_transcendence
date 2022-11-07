import { User } from '../infrastructure/db/user.entity';

export class UserBlockRelation {
  isUserBlockedByMe!: boolean;
  amIBlockedByUser!: boolean;
}
export class UserResponseDto extends User {
  blockRelation: UserBlockRelation | null;

  constructor(userEntity: User, blockRelation: UserBlockRelation | null) {
    super(userEntity);
    this.blockRelation = blockRelation;
  }
}

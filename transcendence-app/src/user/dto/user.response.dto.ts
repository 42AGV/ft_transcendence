import { User } from '../infrastructure/db/user.entity';

export class UserBlockRelation {
  isUserBlockedByMe!: boolean;
  amIBlockedByUser!: boolean;
}
export class UserResponseDto extends User {
  blockRelation: UserBlockRelation | null;
  isFriend: boolean;

  constructor(
    userEntity: User,
    blockRelation: UserBlockRelation | null,
    isFriend: boolean,
  ) {
    super(userEntity);
    this.blockRelation = blockRelation;
    this.isFriend = isFriend;
  }
}

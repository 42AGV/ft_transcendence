import { UserWithLevelDto } from '../../shared/dtos/user-with-level.dto';

export class UserBlockRelation {
  isUserBlockedByMe!: boolean;
  amIBlockedByUser!: boolean;
}
export class UserResponseDto extends UserWithLevelDto {
  blockRelation: UserBlockRelation | null;
  isFriend: boolean | null;

  constructor(
    userEntity: UserWithLevelDto,
    blockRelation: UserBlockRelation | null,
    isFriend: boolean | null,
  ) {
    super(userEntity);
    this.blockRelation = blockRelation;
    this.isFriend = isFriend;
  }
}

import {
  UserWithLevelData,
  UserWithLevelDto,
} from '../../shared/dtos/user-with-level.dto';

export interface UserWithAuthorizationResponseDtoData
  extends UserWithLevelData {
  readonly isLocal: boolean;
  readonly gOwner: boolean;
  readonly gAdmin: boolean;
  readonly gBanned: boolean;
}
export class UserWithAuthorizationResponseDto extends UserWithLevelDto {
  public readonly isLocal: boolean;
  public readonly gOwner: boolean;
  public readonly gAdmin: boolean;
  public readonly gBanned: boolean;
  constructor({
    isLocal,
    gOwner,
    gAdmin,
    gBanned,
    ...user
  }: UserWithAuthorizationResponseDtoData) {
    super(user);
    this.isLocal = isLocal;
    this.gAdmin = gAdmin;
    this.gOwner = gOwner;
    this.gBanned = gBanned;
  }
}

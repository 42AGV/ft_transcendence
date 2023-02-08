import { User, UserData } from '../../user/infrastructure/db/user.entity';

export interface UserWithAuthorizationResponseDtoData extends UserData {
  readonly isLocal: boolean;
  readonly gOwner: boolean;
  readonly gAdmin: boolean;
  readonly gBanned: boolean;
}
export class UserWithAuthorizationResponseDto extends User {
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

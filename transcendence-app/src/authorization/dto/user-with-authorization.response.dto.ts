import { User, UserData } from '../../user/infrastructure/db/user.entity';

export interface UserWithAuthorizationResponseDtoData extends UserData {
  readonly g_owner: boolean;
  readonly g_admin: boolean;
  readonly g_banned: boolean;
}
export class UserWithAuthorizationResponseDto extends User {
  public readonly g_owner: boolean;
  public readonly g_admin: boolean;
  public readonly g_banned: boolean;
  constructor({
    g_owner,
    g_admin,
    g_banned,
    ...user
  }: UserWithAuthorizationResponseDtoData) {
    super(user);
    this.g_admin = g_admin;
    this.g_owner = g_owner;
    this.g_banned = g_banned;
  }
}

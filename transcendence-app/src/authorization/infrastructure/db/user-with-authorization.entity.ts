export interface UserWithAuthorizationData {
  readonly userId: string;
  readonly username: string;
  readonly g_owner: boolean;
  readonly g_admin: boolean;
  readonly g_banned: boolean;
}

export class UserWithAuthorization {
  public readonly userId: string;
  readonly username: string;
  public readonly g_owner: boolean;
  public readonly g_admin: boolean;
  public readonly g_banned: boolean;
  constructor({
    userId,
    username,
    g_owner,
    g_admin,
    g_banned,
  }: UserWithAuthorizationData) {
    this.userId = userId;
    this.username = username;
    this.g_admin = g_admin;
    this.g_owner = g_owner;
    this.g_banned = g_banned;
  }
}

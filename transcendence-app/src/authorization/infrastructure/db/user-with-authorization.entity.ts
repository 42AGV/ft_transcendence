export interface UserWithAuthorizationData {
  readonly userId: string;
  readonly username: string;
  readonly g_isOwner: boolean;
  readonly g_isModerator: boolean;
  readonly g_isBanned: boolean;
}

export class UserWithAuthorization {
  public readonly userId: string;
  readonly username: string;
  public readonly g_isOwner: boolean;
  public readonly g_isModerator: boolean;
  public readonly g_isBanned: boolean;
  constructor({
    userId,
    username,
    g_isOwner,
    g_isModerator,
    g_isBanned,
  }: UserWithAuthorizationData) {
    this.userId = userId;
    this.username = username;
    this.g_isModerator = g_isModerator;
    this.g_isOwner = g_isOwner;
    this.g_isBanned = g_isBanned;
  }
}

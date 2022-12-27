export interface UserWithAuthorizationData {
  readonly userId: string;
  readonly username: string;
  readonly gOwner: boolean;
  readonly gAdmin: boolean;
  readonly gBanned: boolean;
}

export class UserWithAuthorization {
  public readonly userId: string;
  readonly username: string;
  public readonly gOwner: boolean;
  public readonly gAdmin: boolean;
  public readonly gBanned: boolean;
  constructor({
    userId,
    username,
    gOwner,
    gAdmin,
    gBanned,
  }: UserWithAuthorizationData) {
    this.userId = userId;
    this.username = username;
    this.gAdmin = gAdmin;
    this.gOwner = gOwner;
    this.gBanned = gBanned;
  }
}

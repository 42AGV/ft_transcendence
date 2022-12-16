export interface GlobalAuthUserCtxData {
  readonly userId: string;
  readonly g_isOwner: boolean;
  readonly g_isModerator: boolean;
  readonly g_isBanned: boolean;
}

export class GlobalAuthUserCtx {
  public readonly userId: string;
  public readonly g_isOwner: boolean;
  public readonly g_isModerator: boolean;
  public readonly g_isBanned: boolean;
  constructor({
    userId,
    g_isOwner,
    g_isModerator,
    g_isBanned,
  }: GlobalAuthUserCtxData) {
    this.userId = userId;
    this.g_isModerator = g_isModerator;
    this.g_isOwner = g_isOwner;
    this.g_isBanned = g_isBanned;
  }
}

export interface GlobalAuthUserCtxData {
  readonly g_isOwner: boolean;
  readonly g_isModerator: boolean;
  readonly g_isBanned: boolean;
}

export class GlobalAuthUserCtx {
  public readonly g_isOwner: boolean;
  public readonly g_isModerator: boolean;
  public readonly g_isBanned: boolean;
  constructor({ g_isOwner, g_isModerator, g_isBanned }: GlobalAuthUserCtxData) {
    this.g_isModerator = g_isModerator;
    this.g_isOwner = g_isOwner;
    this.g_isBanned = g_isBanned;
  }
}

import { GlobalAuthUserCtx, GlobalAuthUserCtxData } from './authuser.global';

export interface AuthUserCtxForUserData extends GlobalAuthUserCtxData {
  readonly crm_isSelf: boolean;
}
export class AuthUserCtxForUser extends GlobalAuthUserCtx {
  public readonly crm_isSelf: boolean;
  constructor({
    crm_isSelf,
    g_isOwner,
    g_isModerator,
    g_isBanned,
  }: AuthUserCtxForUserData) {
    super({ g_isOwner, g_isModerator, g_isBanned });
    this.crm_isSelf = crm_isSelf;
  }
}

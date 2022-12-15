import { GlobalAuthUserCtx, GlobalAuthUserCtxData } from './authuser.global';

export interface AuthUserCtxForChatroomMemberData
  extends GlobalAuthUserCtxData {
  readonly crm_isMember: boolean;
  readonly crm_isOwner?: boolean;
  readonly crm_isAdmin?: boolean;
  readonly crm_isBanned?: boolean;
}
export class AuthUserCtxForChatroomMember extends GlobalAuthUserCtx {
  public readonly crm_isMember: boolean;
  public readonly crm_isOwner?: boolean;
  public readonly crm_isAdmin?: boolean;
  public readonly crm_isBanned?: boolean;
  constructor({
    userId,
    g_isOwner,
    g_isModerator,
    g_isBanned,
    crm_isMember,
    crm_isOwner,
    crm_isAdmin,
    crm_isBanned,
  }: AuthUserCtxForChatroomMemberData) {
    super({ userId, g_isOwner, g_isModerator, g_isBanned });
    this.crm_isMember = crm_isMember;
    this.crm_isOwner = crm_isOwner;
    this.crm_isAdmin = crm_isAdmin;
    this.crm_isBanned = crm_isBanned;
  }
}

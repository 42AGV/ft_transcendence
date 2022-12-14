import {
  AuthUserCtxForChatroomMember,
  AuthUserCtxForChatroomMemberData,
} from './authuser.chatroom-member';

export interface AuthUserCtxForChatroomData
  extends AuthUserCtxForChatroomMemberData {
  readonly cr_isMuted?: boolean;
}
export class AuthUserCtxForChatroom extends AuthUserCtxForChatroomMember {
  public readonly cr_isMuted?: boolean;
  constructor({
    g_isOwner,
    g_isModerator,
    g_isBanned,
    crm_isMember,
    crm_isOwner,
    crm_isAdmin,
    crm_isBanned,
    cr_isMuted,
  }: AuthUserCtxForChatroomData) {
    super({
      g_isOwner,
      g_isModerator,
      g_isBanned,
      crm_isMember,
      crm_isOwner,
      crm_isAdmin,
      crm_isBanned,
    });
    this.cr_isMuted = cr_isMuted;
  }
}

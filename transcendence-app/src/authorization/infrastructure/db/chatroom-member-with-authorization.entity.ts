import {
  UserWithAuthorization,
  UserWithAuthorizationData,
} from './user-with-authorization.entity';

export interface ChatroomMemberWithAuthorizationData
  extends UserWithAuthorizationData {
  readonly crm_isMember: boolean;
  readonly crm_isOwner?: boolean;
  readonly crm_isAdmin?: boolean;
  readonly crm_isBanned?: boolean;
  readonly cr_isMuted?: boolean;
}
export class ChatroomMemberWithAuthorization extends UserWithAuthorization {
  public readonly crm_isMember: boolean;
  public readonly crm_isOwner?: boolean;
  public readonly crm_isAdmin?: boolean;
  public readonly crm_isBanned?: boolean;
  public readonly cr_isMuted?: boolean;
  constructor({
    userId,
    username,
    g_isOwner,
    g_isModerator,
    g_isBanned,
    crm_isMember,
    crm_isOwner,
    crm_isAdmin,
    crm_isBanned,
    cr_isMuted,
  }: ChatroomMemberWithAuthorizationData) {
    super({ userId, username, g_isOwner, g_isModerator, g_isBanned });
    this.crm_isMember = crm_isMember;
    this.crm_isOwner = crm_isOwner;
    this.crm_isAdmin = crm_isAdmin;
    this.crm_isBanned = crm_isBanned;
    this.cr_isMuted = cr_isMuted;
  }
}

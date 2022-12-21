import {
  UserWithAuthorization,
  UserWithAuthorizationData,
} from './user-with-authorization.entity';

export interface ChatroomMemberWithAuthorizationData
  extends UserWithAuthorizationData {
  readonly chatId: string;
  readonly crm_member: boolean;
  readonly crm_owner?: boolean;
  readonly crm_admin?: boolean;
  readonly crm_banned?: boolean;
  readonly cr_muted?: boolean;
}
export class ChatroomMemberWithAuthorization extends UserWithAuthorization {
  public readonly chatId: string;
  public readonly crm_member: boolean;
  public readonly crm_owner?: boolean;
  public readonly crm_admin?: boolean;
  public readonly crm_banned?: boolean;
  public readonly cr_muted?: boolean;
  constructor({
    userId,
    username,
    g_owner,
    g_admin,
    g_banned,
    chatId,
    crm_member,
    crm_owner,
    crm_admin,
    crm_banned,
    cr_muted,
  }: ChatroomMemberWithAuthorizationData) {
    super({
      userId,
      username,
      g_owner,
      g_admin,
      g_banned,
    });
    this.chatId = chatId;
    this.crm_member = crm_member;
    this.crm_owner = crm_owner;
    this.crm_admin = crm_admin;
    this.crm_banned = crm_banned;
    this.cr_muted = cr_muted;
  }
}

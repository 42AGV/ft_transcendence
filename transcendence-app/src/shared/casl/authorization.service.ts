import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Chatroom } from '../../chat/chatroom/infrastructure/db/chatroom.entity';
import { ChatroomMemberService } from '../../chat/chatroom/chatroom-member/chatroom-member.service';
import { User } from '../../user/infrastructure/db/user.entity';
import { Role } from '../enums/role.enum';

type Game = { isHighLevel?: boolean }; // this is an example

export type AuthUserCtx = {
  g_isOwner: boolean;
  g_isModerator: boolean;
  g_isBanned: boolean;
  crm_isMember?: boolean;
  crm_isOwner?: boolean;
  crm_isAdmin?: boolean;
  crm_isMuted?: boolean;
  crm_isBanned?: boolean;
};
@Injectable()
export class AuthorizationService {
  constructor(
    private userService: UserService,
    private chatroomMemberService: ChatroomMemberService,
  ) {}

  async GetUserAuthContext(
    user: User,
    chatroomOrGame?: Chatroom | Game,
  ): Promise<AuthUserCtx | null> {
    const g_user = await this.userService.getUserWithRolesFromId(user.id);
    if (!g_user) {
      return null;
    }
    if (chatroomOrGame instanceof Chatroom) {
      const crm = await this.chatroomMemberService.getById(
        chatroomOrGame.id,
        user.id,
      );
      const isMember = !!crm && crm.joinedAt !== null;
      return {
        g_isOwner: g_user.roles.includes(Role.owner),
        g_isModerator: g_user.roles.includes(Role.moderator),
        g_isBanned: g_user.roles.includes(Role.banned),
        crm_isOwner: user.id === chatroomOrGame.ownerId,
        crm_isMember: isMember,
        crm_isAdmin: (isMember && crm.admin) || undefined,
        crm_isMuted: (isMember && crm.muted) || undefined,
        crm_isBanned: (isMember && crm?.banned) || undefined,
      };
    }
    return {
      g_isOwner: g_user.roles.includes(Role.owner),
      g_isModerator: g_user.roles.includes(Role.moderator),
      g_isBanned: g_user.roles.includes(Role.banned),
    };
  } //
}

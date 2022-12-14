import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ChatroomMemberService } from '../../chat/chatroom/chatroom-member/chatroom-member.service';
import { User } from '../../user/infrastructure/db/user.entity';
import { Role } from '../enums/role.enum';
import { ChatService } from '../../chat/chat.service';

class Game {
  isHighLevel?: boolean;
} // this is an example

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
    private chatService: ChatService,
  ) {}

  async GetUserAuthContext(
    user: User,
    chatroomIdOrGame: string | Game,
  ): Promise<AuthUserCtx | null> {
    const g_user = await this.userService.getUserWithRolesFromId(user.id);
    if (!g_user) {
      return null;
    }
    if (!(chatroomIdOrGame instanceof Game)) {
      const cr = await this.chatService.getChatroomById(chatroomIdOrGame);
      const crm = await this.chatroomMemberService.getById(
        chatroomIdOrGame,
        user.id,
      );
      if (!cr) {
        throw new NotFoundException();
      }
      const isMember = !!crm && crm.joinedAt !== null;
      return {
        g_isOwner: g_user.roles.includes(Role.owner),
        g_isModerator: g_user.roles.includes(Role.moderator),
        g_isBanned: g_user.roles.includes(Role.banned),
        crm_isOwner: user.id === cr.ownerId,
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

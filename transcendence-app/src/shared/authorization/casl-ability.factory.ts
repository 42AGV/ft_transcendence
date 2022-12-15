import {
  AbilityBuilder,
  AnyMongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Action } from '../enums/action.enum';
import { GlobalAuthUserCtx } from './authorizationContext/authuser.global';
import { AuthUserCtxForChatroom } from './authorizationContext/authuser.chatroom';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class CaslAbilityFactory {
  constructor(private authorizationService: AuthorizationService) {}
  private async setGlobalAbilities(
    { can, cannot }: AbilityBuilder<AnyMongoAbility>,
    globalUserAuthCtx: GlobalAuthUserCtx,
  ) {
    if (globalUserAuthCtx.g_isBanned) {
      cannot(Action.Manage, 'all');
    } else if (globalUserAuthCtx.g_isModerator) {
      can(Action.Manage, 'all');
    }
    if (globalUserAuthCtx.g_isOwner) {
      can(Action.Manage, 'all');
    }
  }
  async defineAbilitiesForCrm(authUserId: string, chatroomId: string) {
    const chatroomMember =
      await this.authorizationService.GetUserAuthContextForChatroomMember(
        authUserId,
        chatroomId,
      );
    if (!chatroomMember) {
      throw new NotFoundException();
    }
    const abilityCtx = new AbilityBuilder(createMongoAbility);
    const { can, cannot, build } = abilityCtx;
    if (!chatroomMember.crm_isMember || chatroomMember.crm_isBanned) {
      cannot(Action.Manage, 'ChatroomMember');
      await this.setGlobalAbilities(abilityCtx, chatroomMember);
      return build();
    }
    can(Action.Read, 'ChatroomMember');
    can(Action.Delete, 'ChatroomMember', {
      userId: chatroomMember.userId,
    });
    if (chatroomMember.crm_isAdmin) {
      can(Action.Update, 'ChatroomMember', ['muted', 'banned'], {
        admin: false,
      });
      can(Action.Delete, 'ChatroomMember', { admin: false });
    }
    if (chatroomMember.crm_isOwner) {
      can(Action.Manage, 'ChatroomMember');
      cannot(Action.Delete, 'ChatroomMember', {
        userId: chatroomMember.userId,
      });
    }
    await this.setGlobalAbilities(abilityCtx, chatroomMember);
    return build();
  }

  async defineAbilitiesForCr(chatroomMember: AuthUserCtxForChatroom) {
    const abilityCtx = new AbilityBuilder(createMongoAbility);
    const { can, cannot, build } = abilityCtx;
    if (chatroomMember.crm_isMember && chatroomMember.crm_isOwner) {
      can(Action.Manage, 'Chatroom');
    } else {
      can(Action.Read, 'Chatroom');
    }
    if (chatroomMember.crm_isMember && chatroomMember.crm_isBanned) {
      cannot(Action.enterCr, 'Chatroom');
    }
    if (chatroomMember.crm_isMember) {
      cannot(Action.JoinCr, 'Chatroom');
    } else {
      can(Action.JoinCr, 'Chatroom');
    }
    await this.setGlobalAbilities(abilityCtx, chatroomMember);
    return build();
  }
}

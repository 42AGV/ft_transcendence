import {
  AbilityBuilder,
  AnyMongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../enums/action.enum';
import { AuthUserCtxForChatroomMember } from './authorizationContext/authuser.chatroom-member';
import { GlobalAuthUserCtx } from './authorizationContext/authuser.global';
import { AuthUserCtxForChatroom } from './authorizationContext/authuser.chatroom';

@Injectable()
export class CaslAbilityFactory {
  private setGlobalAbilities(
    { can, cannot }: AbilityBuilder<AnyMongoAbility>,
    globalUserAuthCtx: GlobalAuthUserCtx,
  ) {
    if (globalUserAuthCtx.g_isBanned) {
      cannot(Action.Manage, 'all');
    } else if (globalUserAuthCtx.g_isModerator || globalUserAuthCtx.g_isOwner) {
      can(Action.Manage, 'all');
    }
  }
  defineAbilitiesForCrm(chatroomMember: AuthUserCtxForChatroomMember) {
    const abilityCtx = new AbilityBuilder(createMongoAbility);
    const { can, cannot, build } = abilityCtx;
    if (chatroomMember.crm_isMember) {
      can(Action.Read, 'ChatroomMember');
    } else {
      cannot(Action.Manage, 'ChatroomMember');
    }
    if (chatroomMember.crm_isMember && chatroomMember.crm_isAdmin) {
      can(Action.Update, 'ChatroomMember', ['muted', 'banned'], {
        admin: false,
      });
      can(Action.Delete, 'ChatroomMember', { admin: false });
      cannot(Action.Manage, 'ChatroomMember', { admin: true });
      can(Action.Read, 'ChatroomMember');
    }
    if (chatroomMember.crm_isMember && chatroomMember.crm_isOwner) {
      can(Action.Manage, 'ChatroomMember');
    }
    this.setGlobalAbilities(abilityCtx, chatroomMember);
    return build();
  }

  defineAbilitiesForCr(chatroomMember: AuthUserCtxForChatroom) {
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
    this.setGlobalAbilities(abilityCtx, chatroomMember);
    return build();
  }
}

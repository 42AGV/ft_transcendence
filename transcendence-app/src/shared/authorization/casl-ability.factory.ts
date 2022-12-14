import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../enums/action.enum';
import { AuthUserCtx } from './authorization.service';

@Injectable()
export class CaslAbilityFactory {
  defineAbilitiesFor(user: AuthUserCtx) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    if (user.crm_isMember && user.crm_isOwner) {
      can(Action.Manage, 'Chatroom');
    } else {
      can(Action.Read, 'Chatroom');
    }
    if (user.crm_isMember && user.crm_isBanned) {
      cannot(Action.enterCr, 'Chatroom');
    }
    if (user.crm_isMember) {
      cannot(Action.JoinCr, 'Chatroom');
    } else {
      can(Action.JoinCr, 'Chatroom');
    }
    if (!user.g_isBanned) {
      can(Action.Create, 'Chatroom');
    }
    if (user.crm_isMember) {
      can(Action.Read, 'ChatroomMember');
    } else {
      cannot(Action.Manage, 'ChatroomMember');
    }
    if (user.crm_isMember && user.crm_isAdmin) {
      can(Action.Update, 'ChatroomMember', ['muted', 'banned'], {
        admin: false,
      });
      can(Action.Delete, 'ChatroomMember', { admin: false });
      cannot(Action.Manage, 'ChatroomMember', { admin: true });
    }
    if (user.crm_isMember && user.crm_isOwner) {
      can(Action.Manage, 'ChatroomMember');
    }
    if (user.g_isModerator || user.g_isOwner) {
      can(Action.Manage, 'all');
    } else if (user.g_isBanned) {
      cannot(Action.Manage, 'all');
    }
    return build();
  }
}

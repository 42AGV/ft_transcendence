import {
  AbilityBuilder,
  AnyMongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../shared/enums/action.enum';
import { UserWithAuthorization } from './infrastructure/db/user-with-authorization.entity';
import { AuthorizationService } from './authorization.service';
import { ChatroomMemberWithAuthorization } from './infrastructure/db/chatroom-member-with-authorization.entity';

@Injectable()
export class CaslAbilityFactory {
  constructor(private authorizationService: AuthorizationService) {}

  private async setGlobalAbilities(
    { can, cannot, build }: AbilityBuilder<AnyMongoAbility>,
    globalUserAuthCtx: UserWithAuthorization,
  ) {
    if (globalUserAuthCtx.g_banned) {
      cannot(Action.Manage, 'all');
    } else if (globalUserAuthCtx.g_admin && !globalUserAuthCtx.g_owner) {
      can(Action.Manage, 'all');
      // This is not implemented / doesn't exist yet, but is left here as
      // boilerplate to know how does this DSL work
      cannot(Action.Update, 'UpdateUserToRoleDto', {
        owner: { $exists: true },
      });
    }
    if (globalUserAuthCtx.g_owner) {
      can(Action.Manage, 'all');
      cannot(Action.Manage, 'UserToRole', { role: 'owner' });
    }
    return build();
  }

  async defineAbilitiesForCrm(authUserId: string, chatroomId: string) {
    const chatroomMember =
      await this.authorizationService.getUserAuthContextForChatroom(
        authUserId,
        chatroomId,
      );
    const abilityCtx = new AbilityBuilder(createMongoAbility);
    const { can, cannot } = abilityCtx;
    if (!chatroomMember.crm_member || chatroomMember.crm_banned) {
      cannot(Action.Manage, 'ChatroomMember');
      if (!chatroomMember.crm_member) {
        // a user can join a chatroom, i.e. create a chatroom member, if it's
        // not yet a member of that chatroom. We should implement the password
        // checking, and the JoinChatroomDto, maybe, so we can use this.
        can(Action.Create, 'ChatroomMember');
      }
      return this.setGlobalAbilities(abilityCtx, chatroomMember);
    }
    // a user cannot join a chatroom, i.e. create a chatroom member, if it's
    // already a member of that chatroom
    cannot(Action.Create, 'ChatroomMember');
    can(Action.Read, 'ChatroomMember');
    can(Action.Delete, 'ChatroomMember', {
      userId: chatroomMember.userId,
    });
    if (chatroomMember.crm_admin) {
      can(Action.Update, 'ChatroomMember');
      cannot(Action.Update, 'ChatroomMember', { admin: true });
      can(Action.Update, 'UpdateChatroomMemberDto');
      cannot(Action.Update, 'UpdateChatroomMemberDto', {
        admin: { $exists: true },
      });
      can(Action.Delete, 'ChatroomMember', { admin: false });
    }
    if (chatroomMember.crm_owner) {
      can(Action.Manage, 'UpdateChatroomMemberDto');
      can(Action.Manage, 'ChatroomMember');
      cannot(Action.Delete, 'ChatroomMember', {
        userId: chatroomMember.userId,
      });
    }
    return this.setGlobalAbilities(abilityCtx, chatroomMember);
  }

  async defineAbilitiesForCr(authUserId: string, chatroomId: string) {
    const chatroomMember: ChatroomMemberWithAuthorization =
      await this.authorizationService.getUserAuthContextForChatroom(
        authUserId,
        chatroomId,
      );
    const abilityCtx = new AbilityBuilder(createMongoAbility);
    const { can } = abilityCtx;
    can(Action.Create, 'Chatroom');
    can(Action.Read, 'Chatroom');
    if (chatroomMember.crm_member && chatroomMember.crm_owner) {
      can(Action.Update, 'Chatroom');
      can(Action.Delete, 'Chatroom');
    }
    return this.setGlobalAbilities(abilityCtx, chatroomMember);
  }
}

import {
  AbilityBuilder,
  AnyMongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Action } from '../shared/enums/action.enum';
import { UserWithAuthorization } from './infrastructure/db/user-with-authorization.entity';
import { AuthorizationService } from './authorization.service';
import { ChatroomMemberWithAuthorization } from './infrastructure/db/chatroom-member-with-authorization.entity';

@Injectable()
export class CaslAbilityFactory {
  constructor(private authorizationService: AuthorizationService) {}
  private async setGlobalAbilities(
    { can, cannot }: AbilityBuilder<AnyMongoAbility>,
    globalUserAuthCtx: UserWithAuthorization,
  ) {
    if (globalUserAuthCtx.g_banned) {
      cannot(Action.Manage, 'all');
    } else if (globalUserAuthCtx.g_admin) {
      can(Action.Manage, 'all');
    }
    if (globalUserAuthCtx.g_owner) {
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
    if (!chatroomMember.crm_member || chatroomMember.crm_banned) {
      cannot(Action.Manage, 'ChatroomMember');
      await this.setGlobalAbilities(abilityCtx, chatroomMember);
      return build();
    }
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
    await this.setGlobalAbilities(abilityCtx, chatroomMember);
    return build();
  }

  async defineAbilitiesForCr(authUserId: string, chatroomId: string) {
    const chatroomMember: ChatroomMemberWithAuthorization =
      await this.authorizationService.GetUserAuthContextForChatroomMember(
        authUserId,
        chatroomId,
      );
    if (!chatroomMember) {
      throw new NotFoundException();
    }
    const abilityCtx = new AbilityBuilder(createMongoAbility);
    const { can, cannot, build } = abilityCtx;
    if (!chatroomMember.crm_member || chatroomMember.crm_banned) {
      cannot(Action.Manage, 'Chatroom');
      if (!chatroomMember.crm_member) {
        can(Action.JoinCr, 'Chatroom');
      }
      if (chatroomMember.crm_banned !== false) {
        cannot(Action.enterCr, 'Chatroom');
        cannot(Action.JoinCr, 'Chatroom');
      }
      await this.setGlobalAbilities(abilityCtx, chatroomMember);
      return build();
    }
    cannot(Action.JoinCr, 'Chatroom');
    can(Action.Read, 'Chatroom');
    if (chatroomMember.crm_owner) {
      can(Action.Manage, 'Chatroom');
    }
    await this.setGlobalAbilities(abilityCtx, chatroomMember);
    return build();
  }
}

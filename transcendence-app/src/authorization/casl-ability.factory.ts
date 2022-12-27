import {
  AbilityBuilder,
  AnyMongoAbility,
  createMongoAbility,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../shared/enums/action.enum';
import { UserWithAuthorization } from './infrastructure/db/user-with-authorization.entity';
import { ChatroomMemberWithAuthorization } from './infrastructure/db/chatroom-member-with-authorization.entity';
import { ChatroomMember } from '../chat/chatroom/chatroom-member/infrastructure/db/chatroom-member.entity';
import { UpdateChatroomMemberDto } from '../chat/chatroom/chatroom-member/dto/update-chatroom-member.dto';
import { Chatroom } from '../chat/chatroom/infrastructure/db/chatroom.entity';
import { Role } from '../shared/enums/role.enum';
import { UserToRole } from './infrastructure/db/user-to-role.entity';
import { UserWithAuthorizationResponseDto } from './dto/user-with-authorization.response.dto';

export type SubjectCtors =
  | typeof ChatroomMember
  | typeof UpdateChatroomMemberDto
  | typeof Chatroom
  | typeof UserToRole
  | typeof UserWithAuthorizationResponseDto;

export type Subject = InferSubjects<SubjectCtors>;

type AppAbility = MongoAbility<[Action, Subject]>;
@Injectable()
export class CaslAbilityFactory {
  private setGlobalAbilities(
    { can, cannot, build }: AbilityBuilder<AnyMongoAbility>,
    globalUserAuthCtx: UserWithAuthorization,
  ) {
    cannot(Action.Read, UserWithAuthorizationResponseDto);
    can(Action.Read, UserWithAuthorizationResponseDto, {
      username: globalUserAuthCtx.username,
    });
    cannot(Action.Manage, UserToRole);
    if (globalUserAuthCtx.gBanned && !globalUserAuthCtx.gOwner) {
      cannot(Action.Manage, 'all');
    } else if (globalUserAuthCtx.gAdmin || globalUserAuthCtx.gOwner) {
      can(Action.Manage, 'all');
    }
    cannot([Action.Create, Action.Update, Action.Delete], UserToRole, {
      role: Role.owner,
    });
    return build({
      detectSubjectType: (object) => object.constructor,
    });
  }

  defineAbilitiesFor(
    user: UserWithAuthorization | ChatroomMemberWithAuthorization,
  ) {
    const abilityCtx = new AbilityBuilder<AppAbility>(createMongoAbility);
    const { can, cannot } = abilityCtx;
    if (user instanceof ChatroomMemberWithAuthorization) {
      // Chatroom Member authorization rules:

      if (!user.crm_member || user.crm_banned) {
        cannot(Action.Manage, ChatroomMember);
        if (!user.crm_member) {
          // a user can join a chatroom, i.e. create a chatroom member, if it's
          // not yet a member of that chatroom. We should implement the password
          // checking, and the JoinChatroomDto, maybe, so we can use this.
          can(Action.Create, ChatroomMember);
        }
        return this.setGlobalAbilities(abilityCtx, user);
      }
      // a user cannot join a chatroom, i.e. create a chatroom member, if it's
      // already a member of that chatroom
      cannot(Action.Create, ChatroomMember);
      can(Action.Read, ChatroomMember);
      can(Action.Delete, ChatroomMember, {
        userId: user.userId,
      });
      if (user.crm_admin) {
        can(Action.Update, ChatroomMember);
        cannot(Action.Update, ChatroomMember, { admin: true });
        can(Action.Update, UpdateChatroomMemberDto);
        cannot(Action.Update, UpdateChatroomMemberDto, {
          admin: { $exists: true },
        });
        can(Action.Delete, ChatroomMember, { admin: false });
      }
      if (user.crm_owner) {
        can(Action.Manage, UpdateChatroomMemberDto);
        can(Action.Manage, ChatroomMember);
        cannot(Action.Delete, ChatroomMember, {
          userId: user.userId,
        });
      }

      // Chatroom authorization rules

      can(Action.Create, Chatroom);
      can(Action.Read, Chatroom);
      if (user.crm_member && user.crm_owner) {
        can(Action.Update, Chatroom);
        can(Action.Delete, Chatroom);
      }
    }
    return this.setGlobalAbilities(abilityCtx, user);
  }
}

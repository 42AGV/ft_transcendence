import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserWithRoles } from '../../user/infrastructure/db/user-with-role.entity';
import { Action } from '../enums/action.enum';
import { Role } from '../enums/role.enum';
import { ChatroomMember } from '../../chat/chatroom/chatroom-member/infrastructure/db/chatroom-member.entity';
import { Chatroom } from '../../chat/chatroom/infrastructure/db/chatroom.entity';

export class ChatroomWithMembers extends Chatroom {
  public readonly chatroomMembers: ChatroomMember[];

  constructor(chatroom: Chatroom, chatroomMembers: ChatroomMember[]) {
    super(chatroom);
    this.chatroomMembers = [...chatroomMembers];
  }
}

@Injectable()
export class CaslAbilityFactory {
  defineAbilitiesFor(user: UserWithRoles) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    can(Action.Manage, ChatroomWithMembers, { ownerId: user.id });
    can(Action.Manage, ChatroomWithMembers, {
      chatroomMembers: { userId: user.id, admin: true },
    });
    can(Action.Read, ChatroomWithMembers, {
      chatroomMembers: { userId: user.id },
    });
    cannot(Action.Manage, ChatroomWithMembers, {
      chatroomMembers: { userId: user.id, banned: true },
    });
    if (
      user.roles.includes(Role.moderator) ||
      user.roles.includes(Role.owner)
    ) {
      can(Action.Manage, 'all');
    }
    return build();
  }
}

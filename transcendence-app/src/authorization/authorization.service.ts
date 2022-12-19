import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '../shared/enums/role.enum';
import { ChatroomMemberWithAuthorization } from './infrastructure/db/chatroom-member-with-authorization.entity';
import { UserToRole } from './infrastructure/db/user-to-role.entity';
import { IUserToRoleRepository } from './infrastructure/db/user-to-role.repository';
import { UserWithAuthorization } from './infrastructure/db/user-with-authorization.entity';
import { IChatroomMemberRepository } from '../chat/chatroom/chatroom-member/infrastructure/db/chatroom-member.repository';

@Injectable()
export class AuthorizationService {
  constructor(
    private chatroomMemberRepository: IChatroomMemberRepository,
    private userToRoleRepository: IUserToRoleRepository,
  ) {}

  async getUserWithRolesFromUsername(
    username: string,
  ): Promise<UserWithAuthorization> {
    const userWithRoles =
      await this.userToRoleRepository.getUserWithAuthorization(username, false);
    if (!userWithRoles) {
      throw new NotFoundException();
    }
    return userWithRoles;
  }

  private async getUserWithRolesFromId(
    id: string,
  ): Promise<UserWithAuthorization> {
    const userWithRoles =
      await this.userToRoleRepository.getUserWithAuthorization(id, true);
    if (!userWithRoles) {
      throw new NotFoundException();
    }
    return userWithRoles;
  }

  async addUserToRole(user: UserToRole): Promise<UserToRole> {
    const userToRole = await this.userToRoleRepository.addUserToRole(
      user.id,
      user.role,
      true,
    );
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async addUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole> {
    const userToRole = await this.userToRoleRepository.addUserToRole(
      username,
      role,
      false,
    );
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async deleteUserToRole(user: UserToRole): Promise<UserToRole> {
    const userToRole = await this.userToRoleRepository.deleteUserToRole(
      user.id,
      user.role,
      true,
    );
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async deleteUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole> {
    const userToRole = await this.userToRoleRepository.deleteUserToRole(
      username,
      role,
      false,
    );
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async GetUserAuthContextForChatroom(
    userId: string,
    chatroomId: string,
  ): Promise<ChatroomMemberWithAuthorization> {
    const g_user = await this.getUserWithRolesFromId(userId);
    const crm = await this.chatroomMemberRepository.getById(chatroomId, userId);
    return new ChatroomMemberWithAuthorization({
      ...g_user,
      crm_member: !!crm,
      crm_owner: crm?.owner,
      crm_admin: crm?.admin,
      crm_banned: crm?.banned,
      cr_muted: crm?.muted,
    });
  }
}

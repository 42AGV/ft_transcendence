import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ChatroomMemberService } from '../chat/chatroom/chatroom-member/chatroom-member.service';
import { Role } from '../shared/enums/role.enum';
import { ChatService } from '../chat/chat.service';
import { ChatroomMemberWithAuthorization } from './infrastructure/db/chatroom-member-with-authorization.entity';
import { UserWithRoles } from './infrastructure/db/user-with-role.entity';
import { UserToRole } from './infrastructure/db/user-to-role.entity';
import { IUserToRoleRepository } from './infrastructure/db/user-to-role.repository';
import { UserWithAuthorization } from './infrastructure/db/user-with-authorization.entity';

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(forwardRef(() => ChatroomMemberService))
    private chatroomMemberService: ChatroomMemberService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private userToRoleRepository: IUserToRoleRepository,
  ) {}

  async getUserWithRolesFromUsername(
    username: string,
  ): Promise<UserWithAuthorization | null> {
    const userWithRoles =
      await this.userToRoleRepository.getUserWithRolesFromUsername(username);
    if (!userWithRoles) {
      throw new NotFoundException();
    }
    return userWithRoles;
  }

  async getUserWithRolesFromId(
    id: string,
  ): Promise<UserWithAuthorization | null> {
    const userWithRoles = await this.userToRoleRepository.getUserWithRolesNew(
      id,
    );
    if (!userWithRoles) {
      throw new NotFoundException();
    }
    return userWithRoles;
  }

  async addUserToRole(user: UserToRole): Promise<UserToRole | null> {
    const userToRole = await this.userToRoleRepository.addUserToRole(user);
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async addUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null> {
    const userToRole =
      await this.userToRoleRepository.addUserToRoleFromUsername(username, role);
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async deleteUserToRole(user: UserToRole): Promise<UserToRole | null> {
    const userToRole = await this.userToRoleRepository.deleteUserToRole(user);
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async deleteUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null> {
    const userToRole =
      await this.userToRoleRepository.deleteUserToRoleFromUsername(
        username,
        role,
      );
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async GetUserAuthContextForChatroomMember(
    userId: string,
    chatroomId: string,
  ): Promise<ChatroomMemberWithAuthorization> {
    const g_user = await this.getUserWithRolesFromId(userId);
    if (!g_user) {
      throw new UnprocessableEntityException();
    }
    const cr = await this.chatService.getChatroomById(chatroomId);
    if (!cr) {
      throw new NotFoundException();
    }
    const crm = await this.chatroomMemberService.getById(chatroomId, userId);
    const isMember = !!crm && crm.joinedAt !== null;
    return new ChatroomMemberWithAuthorization({
      userId,
      username: g_user.username,
      g_owner: g_user.g_owner,
      g_admin: g_user.g_admin,
      g_banned: g_user.g_banned,
      crm_owner: userId === cr.ownerId,
      crm_member: isMember,
      crm_admin: isMember ? crm.admin : undefined,
      crm_banned: isMember ? crm.banned : undefined,
      cr_muted: isMember ? crm.muted : undefined,
    });
  }
}

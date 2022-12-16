import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ChatroomMemberService } from '../chat/chatroom/chatroom-member/chatroom-member.service';
import { Role } from '../shared/enums/role.enum';
import { ChatService } from '../chat/chat.service';
import { AuthUserCtxForChatroomMember } from './infrastructure/authuser.chatroom-member';
import { AuthUserCtxForChatroom } from './infrastructure/authuser.chatroom';
import { UserWithRoles } from '../user/infrastructure/db/user-with-role.entity';
import { UserToRole } from './infrastructure/db/user-to-role.entity';
import { IUserToRoleRepository } from './infrastructure/db/user-to-role.repository';

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ChatroomMemberService))
    private chatroomMemberService: ChatroomMemberService,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private userToRoleRepository: IUserToRoleRepository,
  ) {}

  async getUserWithRolesFromUsername(
    username: string,
  ): Promise<UserWithRoles | null> {
    const user = await this.userService.retrieveUserWithUserName(username);
    if (!user) {
      throw new NotFoundException();
    }
    const userWithRoles = await this.userToRoleRepository.getUserWithRoles(
      user.id,
    );
    if (!userWithRoles) {
      throw new NotFoundException();
    }
    return userWithRoles;
  }

  async getUserWithRolesFromId(id: string): Promise<UserWithRoles | null> {
    const userWithRoles = await this.userToRoleRepository.getUserWithRoles(id);
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
    const user = await this.userService.retrieveUserWithUserName(username);
    if (!user) {
      throw new NotFoundException();
    }
    const userToRole = await this.userToRoleRepository.addUserToRole({
      id: user.id,
      role: role,
    });
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
    role: string,
  ): Promise<UserToRole | null> {
    const user = await this.userService.retrieveUserWithUserName(username);
    if (!user) {
      throw new NotFoundException();
    }
    const userToRole = await this.userToRoleRepository.deleteUserToRole({
      id: user.id,
      role: role as Role,
    });
    if (!userToRole) {
      throw new NotFoundException();
    }
    return userToRole;
  }

  async GetUserAuthContextForChatroomMember(
    userId: string,
    chatroomId: string,
  ): Promise<AuthUserCtxForChatroomMember> {
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
    return new AuthUserCtxForChatroomMember({
      userId,
      g_isOwner: g_user.roles.includes(Role.owner),
      g_isModerator: g_user.roles.includes(Role.moderator),
      g_isBanned: g_user.roles.includes(Role.banned),
      crm_isOwner: userId === cr.ownerId,
      crm_isMember: isMember,
      crm_isAdmin: isMember ? crm.admin : undefined,
      crm_isBanned: isMember ? crm.banned : undefined,
    });
  }
  async GetUserAuthContextForChatroom(
    userId: string,
    chatroomId: string,
  ): Promise<AuthUserCtxForChatroom> {
    const crmclass = await this.GetUserAuthContextForChatroomMember(
      userId,
      chatroomId,
    );
    const crm = await this.chatroomMemberService.getById(chatroomId, userId);
    return new AuthUserCtxForChatroom({
      ...crmclass,
      cr_isMuted: crmclass.crm_isMember && crm ? crm.muted : undefined,
    });
  }
}

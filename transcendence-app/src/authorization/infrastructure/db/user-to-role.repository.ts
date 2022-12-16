import { UserToRole } from './user-to-role.entity';
import { UserWithRoles } from './user-with-role.entity';
import { Role } from '../../../shared/enums/role.enum';
import { ChatroomMemberWithAuthorization } from './chatroom-member-with-authorization.entity';
import { UserWithAuthorization } from './user-with-authorization.entity';

export abstract class IUserToRoleRepository {
  abstract addUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
  abstract addUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null>;
  abstract getUserWithRoles(id: string): Promise<UserWithRoles | null>;
  abstract getUserWithRolesNew(
    id: string,
  ): Promise<UserWithAuthorization | null>;
  abstract getUserWithRolesFromUsername(
    username: string,
  ): Promise<UserWithAuthorization | null>;
  abstract deleteUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
  abstract deleteUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null>;
  abstract getUserWithRolesForChatroom(
    userId: string,
    chatroomId: string,
  ): Promise<ChatroomMemberWithAuthorization | null>;
}

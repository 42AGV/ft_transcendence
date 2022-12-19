import { UserToRole } from './user-to-role.entity';
import { Role } from '../../../shared/enums/role.enum';
import { ChatroomMemberWithAuthorization } from './chatroom-member-with-authorization.entity';
import { UserWithAuthorization } from './user-with-authorization.entity';

export abstract class IUserToRoleRepository {
  abstract addUserToRole(
    username: string,
    role: Role,
    isUserId: boolean,
  ): Promise<UserToRole | null>;
  abstract getUserWithAuthorization(
    id: string,
    isUserId: boolean,
  ): Promise<UserWithAuthorization | null>;
  abstract getUserWithAuthorizationFromUsername(
    username: string,
  ): Promise<UserWithAuthorization | null>;
  abstract deleteUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
  abstract deleteUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null>;
}

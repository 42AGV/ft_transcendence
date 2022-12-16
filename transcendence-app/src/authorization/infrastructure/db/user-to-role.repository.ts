import { UserToRole } from './user-to-role.entity';
import { UserWithRoles } from './user-with-role.entity';
import { Role } from '../../../shared/enums/role.enum';

export abstract class IUserToRoleRepository {
  abstract addUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
  abstract addUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null>;
  abstract getUserWithRoles(id: string): Promise<UserWithRoles | null>;
  abstract getUserWithRolesFromUsername(
    username: string,
  ): Promise<UserWithRoles | null>;
  abstract deleteUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
  abstract deleteUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null>;
}

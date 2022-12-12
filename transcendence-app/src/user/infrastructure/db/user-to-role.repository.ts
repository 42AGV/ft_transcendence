import { UserToRole } from './user-to-role.entity';
import { Role } from '../../../shared/enums/roles.enum';
import { UserWithRoles } from './user-with-role.entity';

export abstract class IUserToRoleRepository {
  abstract addUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
  abstract getUserWithRoles(id: string): Promise<UserWithRoles | null>;
  abstract deleteUserToRole(
    userId: string,
    role: Role,
  ): Promise<UserToRole | null>;
}

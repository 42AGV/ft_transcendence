import { UserToRole } from './user-to-role.entity';
import { UserWithRoles } from './user-with-role.entity';

export abstract class IUserToRoleRepository {
  abstract addUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
  abstract getUserWithRoles(id: string): Promise<UserWithRoles | null>;
  abstract deleteUserToRole(userToRole: UserToRole): Promise<UserToRole | null>;
}

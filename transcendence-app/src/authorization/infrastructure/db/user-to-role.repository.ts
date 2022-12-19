import { UserToRole } from './user-to-role.entity';
import { Role } from '../../../shared/enums/role.enum';
import { UserWithAuthorization } from './user-with-authorization.entity';

export abstract class IUserToRoleRepository {
  abstract addUserToRole(
    userKey: string,
    role: Role,
    isUserId: boolean,
  ): Promise<UserToRole | null>;
  abstract getUserWithAuthorization(
    userKey: string,
    isUserId: boolean,
  ): Promise<UserWithAuthorization | null>;
  abstract deleteUserToRole(
    userKey: string,
    role: Role,
    isUserId: boolean,
  ): Promise<UserToRole | null>;
}

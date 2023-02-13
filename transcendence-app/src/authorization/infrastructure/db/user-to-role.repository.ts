import { UserToRole } from './user-to-role.entity';
import { Role } from 'transcendence-shared';
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
  abstract maybeGetUserToRole(user: UserToRole): Promise<UserToRole | null>;
  abstract deleteUserToRole(
    userKey: string,
    role: Role,
    isUserId: boolean,
  ): Promise<UserToRole | null>;
}

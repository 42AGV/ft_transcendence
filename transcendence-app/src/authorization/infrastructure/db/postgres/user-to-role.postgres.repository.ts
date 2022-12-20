import {
  UserToRole,
  UserToRoleData,
  UserToRoleKeys,
} from '../user-to-role.entity';
import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { IUserToRoleRepository } from '../user-to-role.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { table } from '../../../../shared/db/models';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { userKeys } from '../../../../user/infrastructure/db/user.entity';
import { Role } from '../../../../shared/enums/role.enum';
import {
  UserWithAuthorization,
  UserWithAuthorizationData,
} from '../user-with-authorization.entity';

@Injectable()
export class UserToRolePostgresRepository
  extends BasePostgresRepository<UserToRole>
  implements IUserToRoleRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USER_TO_ROLE, UserToRole);
  }

  async addUserToRole(
    userKey: string,
    role: Role,
    isUserId: boolean,
  ): Promise<UserToRole | null> {
    const userKeyMatcher = isUserId
      ? `u.${userKeys.ID}`
      : `u.${userKeys.USERNAME}`;
    const userData = await makeQuery<UserToRole>(this.pool, {
      text: `WITH myUser as (SELECT u.${userKeys.ID}
                             FROM ${table.USERS} u
                             WHERE ${userKeyMatcher} = $1)
             INSERT
             INTO ${this.table} (${UserToRoleKeys.ID}, ${UserToRoleKeys.ROLE})
             VALUES ((SELECT ${userKeys.ID} from myUser), $2)
             RETURNING *;`,
      values: [userKey, role],
    });
    return userData && userData.length > 0 ? new UserToRole(userData[0]) : null;
  }

  async getUserWithAuthorization(
    userKey: string,
    isUserId: boolean,
  ): Promise<UserWithAuthorization | null> {
    const userKeyMatcher = isUserId
      ? `u.${userKeys.ID}`
      : `u.${userKeys.USERNAME}`;
    const userData = await makeQuery<UserWithAuthorizationData>(this.pool, {
      text: `WITH UserWithRoles AS (SELECT u.${userKeys.ID},
                                           u.${userKeys.USERNAME},
                                           coalesce(array_agg(ur.${UserToRoleKeys.ROLE})
                                                    FILTER
                                                      (WHERE ur.${UserToRoleKeys.ROLE} IS NOT NULL),
                                                    '{}') as roles
                                    FROM ${table.USERS} u
                                           LEFT JOIN ${this.table} ur ON ur.${UserToRoleKeys.ID} = u.${userKeys.ID}
                                    WHERE ${userKeyMatcher} = $1
                                    GROUP BY u.${userKeys.ID})
             SELECT ${userKeys.ID}                                       as "userId",
                    ${userKeys.USERNAME},
                    (SELECT roles from UserWithRoles) @> '{"owner"}'     as g_owner,
                    (SELECT roles from UserWithRoles) @> '{"moderator"}' as g_admin,
                    (SELECT roles from UserWithRoles) @> '{"banned"}'    as g_banned
             FROM UserWithRoles;`,
      values: [userKey],
    });
    return userData && userData.length
      ? new UserWithAuthorization(userData[0])
      : null;
  }

  async deleteUserToRole(
    userKey: string,
    role: Role,
    isUserId: boolean,
  ): Promise<UserToRole | null> {
    const userKeyMatcher = isUserId
      ? `u.${userKeys.ID}`
      : `u.${userKeys.USERNAME}`;
    const roleData = await makeQuery<UserToRoleData>(this.pool, {
      text: `
        WITH myUser as (SELECT u.${userKeys.ID}
                        FROM ${table.USERS} u
                        WHERE ${userKeyMatcher} = $1)
        DELETE
        FROM ${this.table} as ur
        WHERE ur.${UserToRoleKeys.ID} = (SELECT ${userKeys.ID} from myUser)
          AND ur.${UserToRoleKeys.ROLE} = $2
        RETURNING *;`,
      values: [userKey, role],
    });
    return roleData && roleData.length > 0 ? new UserToRole(roleData[0]) : null;
  }
}

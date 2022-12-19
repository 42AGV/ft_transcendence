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
import { UserId, UserIdData } from '../userid.entity';
import { ChatroomMemberWithAuthorization } from '../chatroom-member-with-authorization.entity';
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
    username: string,
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
      values: [username, role],
    });
    return userData && userData.length > 0 ? new UserToRole(userData[0]) : null;
  }

  private async getUserIdFromUsername(
    username: string,
  ): Promise<UserId | null> {
    const userData = await makeQuery<UserIdData>(this.pool, {
      text: `SELECT u.${userKeys.ID}
             FROM ${table.USERS} u
             WHERE u.${userKeys.USERNAME} = $1;`,
      values: [username],
    });
    return userData && userData.length > 0 ? new UserId(userData[0]) : null;
  }

  async getUserWithAuthorization(
    userId: string,
    isUserId: boolean,
  ): Promise<UserWithAuthorization | null> {
    const userKeyMatcher = isUserId
      ? `u.${userKeys.ID}`
      : `u.${userKeys.USERNAME}`;
    const members = await makeQuery<UserWithAuthorizationData>(this.pool, {
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
             SELECT ${userKeys.ID}                                                          as userId,
                    ${userKeys.USERNAME},
                    to_jsonb((SELECT roles from UserWithRoles)) @> '["owner"]'::jsonb       as g_owner,
                    to_jsonb(((SELECT roles from UserWithRoles))) @> '["moderator"]'::jsonb as g_admin,
                    to_jsonb(((SELECT roles from UserWithRoles))) @> '["banned"]'::jsonb    as g_banned
             FROM UserWithRoles;`,
      values: [userId],
    });
    return members && members.length
      ? new UserWithAuthorization(members[0])
      : null;
  }

  async getUserWithAuthorizationFromUsername(
    username: string,
  ): Promise<UserWithAuthorization | null> {
    return this.getUserWithAuthorization(username, false);
  }

  async deleteUserToRole({ id, role }: UserToRole): Promise<UserToRole | null> {
    const roleData = await makeQuery<UserToRoleData>(this.pool, {
      text: `DELETE
             FROM ${this.table} as ur
             WHERE ur.${UserToRoleKeys.ID} = $1
               AND ur.${UserToRoleKeys.ROLE} = $2
             RETURNING *;`,
      values: [id, role],
    });
    return roleData && roleData.length > 0 ? new UserToRole(roleData[0]) : null;
  }

  async deleteUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null> {
    const id = await this.getUserIdFromUsername(username);
    if (!id) {
      return null;
    }
    return this.deleteUserToRole({ id: id.id, role });
  }
}

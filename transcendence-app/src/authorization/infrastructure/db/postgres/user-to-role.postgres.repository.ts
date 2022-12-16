import { UserToRole, userToRoleKeys } from '../user-to-role.entity';
import { UserWithRoles, UserWithRolesData } from '../user-with-role.entity';
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

@Injectable()
export class UserToRolePostgresRepository
  extends BasePostgresRepository<UserToRole>
  implements IUserToRoleRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USER_TO_ROLE, UserToRole);
  }

  async addUserToRole(userToRole: UserToRole): Promise<UserToRole | null> {
    return this.add(userToRole);
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

  async addUserToRoleFromUsername(
    username: string,
    role: Role,
  ): Promise<UserToRole | null> {
    const id = await this.getUserIdFromUsername(username);
    if (!id) {
      return null;
    }
    return this.addUserToRole({ id: id.id, role: role });
  }

  async getUserWithRoles(id: string): Promise<UserWithRoles | null> {
    const userData = await makeQuery<UserWithRolesData>(this.pool, {
      text: `SELECT u.${userKeys.ID}, u.${userKeys.USERNAME},
                    coalesce(array_agg(ur.${userToRoleKeys.ROLE}) FILTER (WHERE ur.${userToRoleKeys.ROLE} IS NOT NULL),
                             '{}') as roles
             FROM ${table.USERS} u
                      LEFT JOIN ${this.table} ur ON ur.${userToRoleKeys.ID} = u.${userKeys.ID}
             WHERE u.${userKeys.ID} = $1
             GROUP BY u.${userKeys.ID};`,
      values: [id],
    });
    return userData && userData.length > 0
      ? new UserWithRoles(userData[0])
      : null;
  }

  async getUserWithRolesFromUsername(
    username: string,
  ): Promise<UserWithRoles | null> {
    const id = await this.getUserIdFromUsername(username);
    if (!id) {
      return null;
    }
    return this.getUserWithRoles(id.id);
  }

  async deleteUserToRole({ id, role }: UserToRole): Promise<UserToRole | null> {
    const roleData = await makeQuery<UserToRole>(this.pool, {
      text: `DELETE
             FROM ${this.table} as ur
             WHERE ur.${userToRoleKeys.ID} = $1
               AND ur.${userToRoleKeys.ROLE} = $2
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

  async getUserWithRolesForChatroom(
    userId: string,
    chatroomId: string,
  ): Promise<ChatroomMemberWithAuthorization | null> {
    return null;
  }
}

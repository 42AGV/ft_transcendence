import { UserToRole, userToRoleKeys } from '../user-to-role.entity';
import { UserWithRoles, UserWithRolesData } from '../user-with-role.entity';
import { Role } from '../../../../shared/enums/roles.enum';
import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { IUserToRoleRepository } from '../user-to-role.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { table } from '../../../../shared/db/models';
import { makeQuery } from '../../../../shared/db/postgres/utils';

@Injectable()
export class UserToRolePostgresRepository
  extends BasePostgresRepository<UserToRole>
  implements IUserToRoleRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USERTOROLE, UserToRole);
  }

  async addUserToRole(userToRole: UserToRole): Promise<UserToRole | null> {
    return this.add(userToRole);
  }

  async getUserWithRoles(id: string): Promise<UserWithRoles | null> {
    const userData = await makeQuery<UserWithRolesData>(this.pool, {
      text: `SELECT u.*,
                    array_agg(ur.${userToRoleKeys.ROLE}) FILTER (WHERE ur.${userToRoleKeys.ROLE} IS NOT NULL) as roles
             FROM ${table.USERS} u
                    LEFT JOIN ${this.table} ur ON ur.${userToRoleKeys.ID} = $1;`,
      values: [id],
    });
    return userData ? new UserWithRoles(userData[0]) : null;
  }

  async deleteUserToRole(
    userId: string,
    role: Role,
  ): Promise<UserToRole | null> {
    const roleData = await makeQuery<UserToRole>(this.pool, {
      text: `DELETE
             FROM ${this.table} as ur
             WHERE ur.${userToRoleKeys.ID} = $1
               AND ur.${userToRoleKeys.ROLE} = $2
             RETURNING *;`,
      values: [userId, role as string],
    });
    return roleData ? new UserToRole(roleData[0]) : null;
  }
}

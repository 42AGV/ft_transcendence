import { Pool } from 'pg';

import { BasePostgresRepository } from 'src/shared/db/postgres/postgres.repository';
import { User } from '../../../user.domain';
import { table } from 'src/shared/db/models';
import { UserEntity, userKeys } from '../../db/user.entity';
import { DataResponseWrapper } from 'src/shared/db/base.repository';
import { IUserRepository } from '../user.repository';

export class UserPostgresRepository
  extends BasePostgresRepository<UserEntity>
  implements IUserRepository
{
  constructor(protected pool: Pool) {
    super(pool, table.USERS);
  }

  async getByUsername(username: string): Promise<DataResponseWrapper<User>> {
    return this.getByKey(userKeys.USERNAME, username);
  }

  async getByEmail(email: string): Promise<DataResponseWrapper<User>> {
    return this.getByKey(userKeys.EMAIL, email);
  }

  async deleteByUsername(username: string): Promise<DataResponseWrapper<User>> {
    return this.deleteByKey(userKeys.USERNAME, username);
  }

  async updateByUsername(
    username: string,
    user: Partial<User>,
  ): Promise<DataResponseWrapper<User>> {
    return this.updateByKey(userKeys.USERNAME, username, user);
  }
}

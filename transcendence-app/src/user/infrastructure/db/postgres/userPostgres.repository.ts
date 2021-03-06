import { Injectable } from '@nestjs/common';

import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { User } from '../../../user.domain';
import { table } from '../../../../shared/db/models';
import { UserEntity, userKeys } from '../../db/user.entity';
import { IUserRepository } from '../user.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';

@Injectable()
export class UserPostgresRepository
  extends BasePostgresRepository<UserEntity>
  implements IUserRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USERS);
  }

  async getById(id: string): Promise<UserEntity | null> {
    return this.getByKey(userKeys.ID, id);
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    return this.getByKey(userKeys.USERNAME, username);
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.getByKey(userKeys.EMAIL, email);
  }

  async deleteByUsername(username: string): Promise<UserEntity | null> {
    return this.deleteByKey(userKeys.USERNAME, username);
  }

  async updateByUsername(
    username: string,
    user: Partial<User>,
  ): Promise<UserEntity | null> {
    return this.updateByKey(userKeys.USERNAME, username, user);
  }
}

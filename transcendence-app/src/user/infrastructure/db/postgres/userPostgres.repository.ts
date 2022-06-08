import { Pool } from 'pg';
import { Injectable } from '@nestjs/common';

import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { User } from '../../../user.domain';
import { table } from '../../../../shared/db/models';
import { UserEntity, userKeys } from '../../db/user.entity';
import { DataResponseWrapper } from '../../../../shared/db/base.repository';
import { IUserRepository } from '../user.repository';

@Injectable()
export class UserPostgresRepository
  extends BasePostgresRepository<UserEntity>
  implements IUserRepository
{
  constructor(protected pool: Pool) {
    super(pool, table.USERS);
  }

  async getById(id: string): Promise<DataResponseWrapper<User>> {
    return this.getByKey(userKeys.ID, id);
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

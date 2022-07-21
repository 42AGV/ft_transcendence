import { Injectable } from '@nestjs/common';

import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { UserEntity, userKeys } from '../../db/user.entity';
import { IUserRepository } from '../user.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { UsersPaginationQueryDto } from '../../../dto/user.pagination.dto';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';

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
    user: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    return this.updateByKey(userKeys.USERNAME, username, user);
  }

  async getPaginatedUsers(
    paginationDto: Required<UsersPaginationQueryDto>,
  ): Promise<UserEntity[] | null> {
    const { limit, offset, sort } = paginationDto;
    const order = sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    const data = await makeQuery<UserEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      ORDER BY ${order}
      LIMIT ${limit}
      OFFSET ${offset};`,
      values: [],
    });

    return data ? data : null;
  }
}

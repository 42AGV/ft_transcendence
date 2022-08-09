import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { UserEntity, userKeys } from '../../db/user.entity';
import { IUserRepository } from '../user.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { UsersPaginationQueryDto } from '../../../dto/user.pagination.dto';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { UpdateUserDto } from '../../../dto/update-user.dto';

@Injectable()
export class UserPostgresRepository
  extends BasePostgresRepository<UserEntity>
  implements IUserRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USERS);
  }

  async getById(id: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.ID, id);
    return users && users.length ? users[0] : null;
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.USERNAME, username);
    return users && users.length ? users[0] : null;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const users = await this.getByKey(userKeys.EMAIL, email);
    return users && users.length ? users[0] : null;
  }

  async deleteByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.deleteByKey(userKeys.USERNAME, username);
    return users && users.length ? users[0] : null;
  }

  async updateById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const users = await this.updateByKey(userKeys.ID, id, updateUserDto);
    return users && users.length ? users[0] : null;
  }

  getPaginatedUsers(
    paginationDto: Required<UsersPaginationQueryDto>,
  ): Promise<UserEntity[] | null> {
    const { limit, offset, sort } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? userKeys.USERNAME : userKeys.ID;
    return makeQuery<UserEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      ORDER BY ${orderBy}
      LIMIT $1
      OFFSET $2;`,
      values: [limit, offset],
    });
  }
}

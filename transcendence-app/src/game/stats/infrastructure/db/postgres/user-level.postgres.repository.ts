import { Injectable } from '@nestjs/common';
import { IUserLevelRepository } from '../user-level.repository';
import { UserLevel, userLevelKeys } from '../user-level.entity';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from 'src/shared/db/models';
import { PostgresPool } from 'src/shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { PaginationQueryDto } from '../../../../../shared/dtos/pagination.query.dto';

@Injectable()
export class UserLevelPostgresRepository
  extends BasePostgresRepository<UserLevel>
  implements IUserLevelRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USER_LEVEL, UserLevel);
  }

  async addLevel(userLevel: UserLevel): Promise<UserLevel | null> {
    return this.add(userLevel);
  }

  async getPaginatedLevels(
    username: string,
    paginationDto: Required<PaginationQueryDto>,
  ): Promise<UserLevel[] | null> {
    const { limit, offset } = paginationDto;
    const orderBy = userLevelKeys.TIMESTAMP;
    const levelsData = await makeQuery<UserLevel>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${userLevelKeys.USERNAME} LIKE $1
      ORDER BY ${orderBy}
      LIMIT $3
      OFFSET $4;`,
      values: [username, limit, offset],
    });
    return levelsData ? levelsData.map((level) => new this.ctor(level)) : null;
  }
}

import { Injectable } from '@nestjs/common';
import { IUserLevelRepository } from '../user-level.repository';
import { UserLevel, userLevelKeys } from '../user-level.entity';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from 'src/shared/db/models';
import { PostgresPool } from 'src/shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { PaginationQueryDto } from '../../../../../shared/dtos/pagination.query.dto';
import { gameKeys } from '../../../../infrastructure/db/game.entity';
import {
  UserLevelWithTimestamp,
  UserLevelWithTimestampData,
} from '../user-level-with-timestamp.entity';

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

  async getLastLevel(username: string): Promise<number> {
    const levelsData = await makeQuery<UserLevelWithTimestampData>(this.pool, {
      text: `WITH ulwtstp AS (SELECT ul.*, g.${gameKeys.CREATED_AT}, g.${gameKeys.GAMEDURATIONINSECONDS}
                              FROM ${this.table} ul
                                       INNER JOIN ${table.GAME} g ON ul.${userLevelKeys.GAMEID} = g.${gameKeys.ID}
                              WHERE ul.${userLevelKeys.USERNAME} LIKE $1)
             select (ults.${gameKeys.CREATED_AT} + interval '1 second' * ults.${gameKeys.GAMEDURATIONINSECONDS}) AS "timestamp",
                    ults.${userLevelKeys.USERNAME},
                    ults.${userLevelKeys.GAMEID},
                    ults.${userLevelKeys.LEVEL}
             FROM ulwtstp ults
             ORDER BY "timestamp" DESC
             LIMIT 1`,
      values: [username],
    });
    return levelsData && levelsData[0] ? levelsData[0].level : 1;
  }

  async getPaginatedLevels(
    username: string,
    paginationDto: Required<PaginationQueryDto>,
  ): Promise<UserLevelWithTimestampData[] | null> {
    const { limit, offset } = paginationDto;
    const levelsData = await makeQuery<UserLevelWithTimestampData>(this.pool, {
      text: `WITH ulwtstp AS (SELECT ul.*, g.${gameKeys.CREATED_AT}, g.${gameKeys.GAMEDURATIONINSECONDS}
                              FROM ${this.table} ul
                                       INNER JOIN ${table.GAME} g ON ul.${userLevelKeys.GAMEID} = g.${gameKeys.ID}
                              WHERE ul.${userLevelKeys.USERNAME} LIKE $1)
             select (ults.${gameKeys.CREATED_AT} + interval '1 second' * ults.${gameKeys.GAMEDURATIONINSECONDS}) AS "timestamp",
                    ults.${userLevelKeys.USERNAME},
                    ults.${userLevelKeys.GAMEID},
                    ults.${userLevelKeys.LEVEL}
             FROM ulwtstp ults
             ORDER BY "timestamp"
             LIMIT $2 OFFSET $3`,
      values: [username, limit, offset],
    });
    return levelsData
      ? levelsData.map((level) => new UserLevelWithTimestamp(level))
      : null;
  }
}

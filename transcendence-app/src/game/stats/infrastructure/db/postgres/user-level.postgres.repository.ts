import { Injectable } from '@nestjs/common';
import { IUserLevelRepository } from '../user-level.repository';
import { UserLevel, userLevelKeys } from '../user-level.entity';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { gameKeys } from '../../../../infrastructure/db/game.entity';
import {
  UserLevelWithTimestamp,
  UserLevelWithTimestampData,
} from '../user-level-with-timestamp.entity';
import { GameMode } from '../../../../enums/game-mode.enum';
import { GameStats, GameStatsData } from '../../../dto/game-stats.dto';

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

  async getLastLevel(username: string, gameMode: GameMode): Promise<number> {
    const levelsData = await makeQuery<UserLevelWithTimestampData>(this.pool, {
      text: `WITH ulwtstp AS (SELECT ul.*, g.${gameKeys.CREATED_AT}, g.${gameKeys.GAMEDURATIONINSECONDS}
                              FROM ${this.table} ul
                                     INNER JOIN ${table.GAME} g ON ul.${userLevelKeys.GAMEID} = g.${gameKeys.ID}
                              WHERE ul.${userLevelKeys.USERNAME} LIKE $1
                                AND g.${gameKeys.GAMEMODE} = $2)
             select (ults.${gameKeys.CREATED_AT} + interval '1 second' * ults.${gameKeys.GAMEDURATIONINSECONDS}) AS "timestamp",
                    ults.${userLevelKeys.USERNAME},
                    ults.${userLevelKeys.GAMEID},
                    ults.${userLevelKeys.LEVEL}
             FROM ulwtstp ults
             ORDER BY "timestamp" DESC
             LIMIT 1`,
      values: [username, gameMode],
    });
    return levelsData && levelsData[0] ? levelsData[0].level : 1;
  }

  async getUserLevels(
    username: string,
    gameMode: GameMode,
  ): Promise<UserLevelWithTimestampData[] | null> {
    const levelsData = await makeQuery<UserLevelWithTimestampData>(this.pool, {
      text: `WITH ulwtstp
                    AS (SELECT ul.*, g.${gameKeys.CREATED_AT}, g.${gameKeys.GAMEDURATIONINSECONDS}, g.${gameKeys.GAMEMODE}
                        FROM ${this.table} ul
                               INNER JOIN ${table.GAME} g ON ul.${userLevelKeys.GAMEID} = g.${gameKeys.ID}
                        WHERE ul.${userLevelKeys.USERNAME} LIKE $1
                          AND g.${gameKeys.GAMEMODE} = $2)
             select (ults.${gameKeys.CREATED_AT} + interval '1 second' * ults.${gameKeys.GAMEDURATIONINSECONDS}) AS "timestamp",
                    ults.${userLevelKeys.USERNAME},
                    ults.${gameKeys.GAMEMODE},
                    ults.${userLevelKeys.GAMEID},
                    ults.${userLevelKeys.LEVEL}
             FROM ulwtstp ults
             ORDER BY "timestamp"`,
      values: [username, gameMode],
    });
    return levelsData
      ? levelsData.map((level) => new UserLevelWithTimestamp(level))
      : null;
  }

  async getGameResults(
    username: string,
    gameMode?: GameMode,
  ): Promise<GameStats | null> {
    let gamesStatsData: GameStatsData[] | null = null;
    if (gameMode) {
      gamesStatsData = await makeQuery<GameStatsData>(this.pool, {
        text: `
          SELECT COUNT(CASE
                         WHEN (${gameKeys.PLAYERONEUSERNAME} = $1 AND ${gameKeys.PLAYERONESCORE} > ${gameKeys.PLAYERTWOSCORE}) OR (${gameKeys.PLAYERTWOUSERNAME} = $1 AND ${gameKeys.PLAYERTWOSCORE} > ${gameKeys.PLAYERONESCORE})
                           THEN 1 END)                                                                                                                                              AS wins,
                 COUNT(CASE
                         WHEN (${gameKeys.PLAYERONEUSERNAME} = $1 AND ${gameKeys.PLAYERONESCORE} < ${gameKeys.PLAYERTWOSCORE}) OR (${gameKeys.PLAYERTWOUSERNAME} = $1 AND ${gameKeys.PLAYERTWOSCORE} < ${gameKeys.PLAYERONESCORE})
                           THEN 1 END)                                                                                                                                              AS losses,
                 COUNT(CASE WHEN (${gameKeys.PLAYERONEUSERNAME} = $1 OR ${gameKeys.PLAYERTWOUSERNAME} = $1) AND ${gameKeys.PLAYERONESCORE} = ${gameKeys.PLAYERTWOSCORE} THEN 1 END) AS draws
          FROM ${table.GAME}
          WHERE (${gameKeys.PLAYERONEUSERNAME} = $1 OR ${gameKeys.PLAYERTWOUSERNAME} = $1)
            AND ${gameKeys.GAMEMODE} = $2;
        `,
        values: [username, gameMode],
      });
    } else {
      gamesStatsData = await makeQuery<GameStatsData>(this.pool, {
        text: `
          SELECT COUNT(CASE
                         WHEN (${gameKeys.PLAYERONEUSERNAME} = $1 AND ${gameKeys.PLAYERONESCORE} > ${gameKeys.PLAYERTWOSCORE}) OR (${gameKeys.PLAYERTWOUSERNAME} = $1 AND ${gameKeys.PLAYERTWOSCORE} > ${gameKeys.PLAYERONESCORE})
                           THEN 1 END)                                                                                                                                              AS wins,
                 COUNT(CASE
                         WHEN (${gameKeys.PLAYERONEUSERNAME} = $1 AND ${gameKeys.PLAYERONESCORE} < ${gameKeys.PLAYERTWOSCORE}) OR (${gameKeys.PLAYERTWOUSERNAME} = $1 AND ${gameKeys.PLAYERTWOSCORE} < ${gameKeys.PLAYERONESCORE})
                           THEN 1 END)                                                                                                                                              AS losses,
                 COUNT(CASE WHEN (${gameKeys.PLAYERONEUSERNAME} = $1 OR ${gameKeys.PLAYERTWOUSERNAME} = $1) AND ${gameKeys.PLAYERONESCORE} = ${gameKeys.PLAYERTWOSCORE} THEN 1 END) AS draws
          FROM ${table.GAME}
          WHERE (${gameKeys.PLAYERONEUSERNAME} = $1 OR ${gameKeys.PLAYERTWOUSERNAME} = $1);
        `,
        values: [username],
      });
    }
    return gamesStatsData && gamesStatsData.length
      ? new GameStats(gamesStatsData[0])
      : null;
  }
}

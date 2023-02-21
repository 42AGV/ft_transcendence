import { Injectable } from '@nestjs/common';
import { IUserLevelRepository } from '../user-level.repository';
import { UserLevel, userLevelKeys } from '../user-level.entity';
import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../../shared/db/postgres/utils';
import { PaginationQueryDto } from '../../../../../shared/dtos/pagination.query.dto';
import {
  Game,
  GameData,
  gameKeys,
} from '../../../../infrastructure/db/game.entity';
import {
  UserLevelWithTimestamp,
  UserLevelWithTimestampData,
} from '../user-level-with-timestamp.entity';
import { GameMode } from '../../../../enums/game-mode.enum';
import { GameStats } from '../../../dto/game-stats.dto';

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

  async getPaginatedLevels(
    username: string,
    gameMode: GameMode,
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

  private async getPaginatedUserGames(
    username: string,
    gameMode?: GameMode,
  ): Promise<Game[] | null> {
    let gamesData;
    if (gameMode) {
      gamesData = await makeQuery<GameData>(this.pool, {
        text: `SELECT *
               FROM ${table.GAME}
               WHERE (${gameKeys.PLAYERONEUSERNAME} = $1
                 OR ${gameKeys.PLAYERTWOUSERNAME} = $1)
                 AND ${gameKeys.GAMEMODE} = $2;`,
        values: [username, gameMode],
      });
    } else {
      gamesData = await makeQuery<GameData>(this.pool, {
        text: `SELECT *
               FROM ${table.GAME}
               WHERE ${gameKeys.PLAYERONEUSERNAME} = $1
                 OR ${gameKeys.PLAYERTWOUSERNAME} = $1;`,
        values: [username],
      });
    }
    return gamesData ? gamesData.map((game) => new Game(game)) : null;
  }

  async getWinGameRatio(
    username: string,
    gameMode?: GameMode,
  ): Promise<GameStats> {
    const games = await this.getPaginatedUserGames(username, gameMode);
    if (!games || games.length === 0) {
      return new GameStats({ tieRatio: 1, winRatio: 0 });
    }
    let wonGames = 0;
    let tyedGames = 0;
    games.forEach((game) => {
      if (game.playerOneUsername === username) {
        if (game.playerOneScore > game.playerTwoScore) {
          wonGames++;
        }
      } else {
        if (game.playerTwoScore > game.playerOneScore) {
          wonGames++;
        } else {
          tyedGames++;
        }
      }
    });
    return new GameStats({
      winRatio: wonGames / games.length,
      tieRatio: tyedGames / games.length,
    });
  }
}

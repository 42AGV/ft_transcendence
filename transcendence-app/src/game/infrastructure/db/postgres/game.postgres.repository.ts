import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { Game, gameKeys } from '../../db/game.entity';
import { IGameRepository } from '../game.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import {
  makeQuery,
  renameColumnsWithPrefix,
} from '../../../../shared/db/postgres/utils';
import { PaginationWithSearchQueryDto } from '../../../../../src/shared/dtos/pagination-with-search.query.dto';
import { BooleanString } from '../../../../shared/enums/boolean-string.enum';
import { GameWithUsers, GameWithUsersData } from '../game-with-users.entity';
import { userKeys } from '../../../../user/infrastructure/db/user.entity';

@Injectable()
export class GamePostgresRepository
  extends BasePostgresRepository<Game>
  implements IGameRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.GAME, Game);
  }

  addGame(game: Game): Promise<Game | null> {
    return this.add(game);
  }

  async getById(id: string): Promise<Game | null> {
    const games = await this.getByKey(gameKeys.ID, id);
    return games && games.length ? games[0] : null;
  }

  async deleteById(id: string): Promise<Game | null> {
    const games = await this.deleteByKey(gameKeys.ID, id);
    return games && games.length ? games[0] : null;
  }

  async getPaginatedGames(
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Game[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? gameKeys.CREATED_AT : gameKeys.ID;
    const gamesData = await makeQuery<Game>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${gameKeys.PLAYERONEUSERNAME} ILIKE $1
      OR ${gameKeys.PLAYERTWOUSERNAME} ILIKE $1
      ORDER BY ${orderBy}, ${gameKeys.ID}
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset],
    });
    return gamesData ? gamesData.map((game) => new this.ctor(game)) : null;
  }

  async getPaginatedUserGames(
    username: string,
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<Game[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? gameKeys.CREATED_AT : gameKeys.ID;
    const gamesData = await makeQuery<Game>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE (${gameKeys.PLAYERONEUSERNAME} = $4
        AND ${gameKeys.PLAYERTWOUSERNAME} ILIKE $1)
      OR (${gameKeys.PLAYERTWOUSERNAME} = $4
        AND ${gameKeys.PLAYERONEUSERNAME} ILIKE $1)
      ORDER BY ${orderBy} DESC, ${gameKeys.ID}
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset, username],
    });
    return gamesData ? gamesData.map((game) => new this.ctor(game)) : null;
  }

  async getPaginatedUserGamesWithUsers(
    username: string,
    paginationDto: Required<PaginationWithSearchQueryDto>,
  ): Promise<GameWithUsers[] | null> {
    const { limit, offset, sort, search } = paginationDto;
    const orderBy =
      sort === BooleanString.True ? gameKeys.CREATED_AT : gameKeys.ID;
    const gamesData = await makeQuery<GameWithUsersData>(this.pool, {
      text: `SELECT g.*,
      ${renameColumnsWithPrefix('p1', Object.values(userKeys), 'playerOne')},
      ${renameColumnsWithPrefix('p2', Object.values(userKeys), 'playerTwo')}
      FROM ${this.table} g
      JOIN ${table.USERS} AS p1 ON g.${gameKeys.PLAYERONEUSERNAME} = p1.${
        userKeys.USERNAME
      }
      JOIN ${table.USERS} AS p2 ON g.${gameKeys.PLAYERTWOUSERNAME} = p2.${
        userKeys.USERNAME
      }
      WHERE (g.${gameKeys.PLAYERONEUSERNAME} = $4
        AND g.${gameKeys.PLAYERTWOUSERNAME} ILIKE $1)
      OR (g.${gameKeys.PLAYERTWOUSERNAME} = $4
        AND g.${gameKeys.PLAYERONEUSERNAME} ILIKE $1)
      ORDER BY g.${orderBy} DESC, g.${gameKeys.ID}
      LIMIT $2
      OFFSET $3;`,
      values: [`%${search}%`, limit, offset, username],
    });
    return gamesData ? gamesData.map((game) => new GameWithUsers(game)) : null;
  }
}

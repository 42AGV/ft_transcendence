import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../shared/db/models';
import { Game, gameKeys } from '../../db/game.entity';
import { IGameRepository } from '../game.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';

@Injectable()
export class GamePostgresRepository
  extends BasePostgresRepository<Game>
  implements IGameRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.USERS, Game);
  }

  async getById(id: string): Promise<Game | null> {
    const games = await this.getByKey(gameKeys.ID, id);
    return games && games.length ? games[0] : null;
  }

  async deleteById(id: string): Promise<Game | null> {
    const games = await this.deleteByKey(gameKeys.ID, id);
    return games && games.length ? games[0] : null;
  }

  async updateById(
    id: string,
    updateGame: Partial<Game>,
  ): Promise<Game | null> {
    const games = await this.updateByKey(gameKeys.ID, id, updateGame);
    return games && games.length ? games[0] : null;
  }
}

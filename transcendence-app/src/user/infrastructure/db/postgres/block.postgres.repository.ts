import { Injectable } from '@nestjs/common';
import { table } from '../../../../shared/db/models';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { Block, BlockKeys } from '../block.entity';
import { IBlockRepository } from '../block.repository';

@Injectable()
export class BlockPostgresRepository
  extends BasePostgresRepository<Block>
  implements IBlockRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.BLOCK, Block);
  }

  addBlock(block: Block): Promise<Block | null> {
    return this.add(block);
  }

  async getBlock(blockerId: string, blockedId: string): Promise<Block | null> {
    const block = await makeQuery<Block>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${BlockKeys.BLOCKER_ID} = $1 AND ${BlockKeys.BLOCKED_ID} = $2;`,
      values: [blockerId, blockedId],
    });
    return block && block.length ? new this.ctor(block[0]) : null;
  }

  async deleteBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<Block | null> {
    const block = await makeQuery<Block>(this.pool, {
      text: `DELETE
      FROM ${this.table}
      WHERE ${BlockKeys.BLOCKER_ID} = $1 AND ${BlockKeys.BLOCKED_ID} = $2
      RETURNING *;`,
      values: [blockerId, blockedId],
    });
    return block && block.length ? new this.ctor(block[0]) : null;
  }
}

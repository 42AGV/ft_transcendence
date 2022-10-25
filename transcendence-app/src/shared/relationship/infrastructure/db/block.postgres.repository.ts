import { Injectable } from '@nestjs/common';
import { table } from '../../../db/models';
import { BasePostgresRepository } from '../../../db/postgres/postgres.repository';
import { PostgresPool } from '../../../db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../db/postgres/utils';
import { BlockEntity, BlockKeys } from '../block.entity';
import { IBlockRepository } from '../block.repository';

@Injectable()
export class BlockPostgresRepository
  extends BasePostgresRepository<BlockEntity>
  implements IBlockRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.BLOCK);
  }

  addBlock(block: BlockEntity): Promise<BlockEntity | null> {
    return this.add(block);
  }

  async getBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<BlockEntity | null> {
    const block = await makeQuery<BlockEntity>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${BlockKeys.BLOCKER_ID} = $1 AND ${BlockKeys.BLOCKED_ID} = $2;`,
      values: [blockerId, blockedId],
    });
    return block && block.length ? block[0] : null;
  }

  async deleteBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<BlockEntity | null> {
    const block = await makeQuery<BlockEntity>(this.pool, {
      text: `DELETE
      FROM ${this.table}
      WHERE ${BlockKeys.BLOCKER_ID} = $1 AND ${BlockKeys.BLOCKED_ID} = $2
      RETURNING *;`,
      values: [blockerId, blockedId],
    });
    return block && block.length ? block[0] : null;
  }
}

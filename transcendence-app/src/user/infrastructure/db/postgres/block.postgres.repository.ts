import { Injectable } from '@nestjs/common';
import { table } from '../../../../shared/db/models';
import { BasePostgresRepository } from '../../../../shared/db/postgres/postgres.repository';
import { PostgresPool } from '../../../../shared/db/postgres/postgresConnection.provider';
import { makeQuery } from '../../../../shared/db/postgres/utils';
import { Block, BlockKeys } from '../block.entity';
import { IBlockRepository } from '../block.repository';
import { User, UserData, userKeys } from '../user.entity';

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
    const blockData = await makeQuery<Block>(this.pool, {
      text: `SELECT *
      FROM ${this.table}
      WHERE ${BlockKeys.BLOCKER_ID} = $1 AND ${BlockKeys.BLOCKED_ID} = $2;`,
      values: [blockerId, blockedId],
    });
    return blockData && blockData.length ? new this.ctor(blockData[0]) : null;
  }

  async deleteBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<Block | null> {
    const blockData = await makeQuery<Block>(this.pool, {
      text: `DELETE
      FROM ${this.table}
      WHERE ${BlockKeys.BLOCKER_ID} = $1 AND ${BlockKeys.BLOCKED_ID} = $2
      RETURNING *;`,
      values: [blockerId, blockedId],
    });
    return blockData && blockData.length ? new this.ctor(blockData[0]) : null;
  }

  async getBlocks(blockerId: string): Promise<User[] | null> {
    const usersData = await makeQuery<UserData>(this.pool, {
      text: `SELECT u.*
      FROM ${this.table} b
      JOIN ${table.USERS} u ON (b.${BlockKeys.BLOCKED_ID} = u.${userKeys.ID})
      WHERE b.${BlockKeys.BLOCKER_ID} = $1`,
      values: [blockerId],
    });
    return usersData ? usersData.map((userData) => new User(userData)) : null;
  }
}

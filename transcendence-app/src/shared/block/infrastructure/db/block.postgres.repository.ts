import { Injectable } from '@nestjs/common';
import { table } from '../../../db/models';
import { BasePostgresRepository } from '../../../db/postgres/postgres.repository';
import { PostgresPool } from '../../../db/postgres/postgresConnection.provider';
import { BlockEntity } from '../block.entity';
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
}

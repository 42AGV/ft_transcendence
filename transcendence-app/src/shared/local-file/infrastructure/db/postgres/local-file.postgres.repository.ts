import { Injectable } from '@nestjs/common';

import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { LocalFileEntity, LocalFileKeys } from '../local-file.entity';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { ILocalFileRepository } from '../local-file.repository';

@Injectable()
export class LocalFilePostgresRepository
  extends BasePostgresRepository<LocalFileEntity>
  implements ILocalFileRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.LOCAL_FILE);
  }

  getById(id: string): Promise<LocalFileEntity | null> {
    return this.getByKey(LocalFileKeys.ID, id);
  }

  deleteById(id: string): Promise<LocalFileEntity | null> {
    return this.deleteByKey(LocalFileKeys.ID, id);
  }

  updateById(
    id: string,
    file: Partial<LocalFileEntity>,
  ): Promise<LocalFileEntity | null> {
    return this.updateByKey(LocalFileKeys.ID, id, file);
  }

  addFile(file: LocalFileEntity): Promise<LocalFileEntity | null> {
    return this.add(file);
  }
}

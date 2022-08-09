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

  async getById(id: string): Promise<LocalFileEntity | null> {
    const files = await this.getByKey(LocalFileKeys.ID, id);
    return files && files.length ? files[0] : null;
  }

  async deleteById(id: string): Promise<LocalFileEntity | null> {
    const files = await this.deleteByKey(LocalFileKeys.ID, id);
    return files && files.length ? files[0] : null;
  }

  async updateById(
    id: string,
    file: Partial<LocalFileEntity>,
  ): Promise<LocalFileEntity | null> {
    const files = await this.updateByKey(LocalFileKeys.ID, id, file);
    return files && files.length ? files[0] : null;
  }

  addFile(file: LocalFileEntity): Promise<LocalFileEntity | null> {
    return this.add(file);
  }
}

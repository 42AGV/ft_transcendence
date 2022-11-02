import { Injectable } from '@nestjs/common';

import { BasePostgresRepository } from '../../../../../shared/db/postgres/postgres.repository';
import { table } from '../../../../../shared/db/models';
import { LocalFile, LocalFileKeys } from '../local-file.entity';
import { PostgresPool } from '../../../../../shared/db/postgres/postgresConnection.provider';
import { ILocalFileRepository } from '../local-file.repository';

@Injectable()
export class LocalFilePostgresRepository
  extends BasePostgresRepository<LocalFile>
  implements ILocalFileRepository
{
  constructor(protected pool: PostgresPool) {
    super(pool, table.LOCAL_FILE, LocalFile);
  }

  async getById(id: string): Promise<LocalFile | null> {
    const files = await this.getByKey(LocalFileKeys.ID, id);
    return files && files.length ? files[0] : null;
  }

  async deleteById(id: string): Promise<LocalFile | null> {
    const files = await this.deleteByKey(LocalFileKeys.ID, id);
    return files && files.length ? files[0] : null;
  }

  async updateById(
    id: string,
    file: Partial<LocalFile>,
  ): Promise<LocalFile | null> {
    const files = await this.updateByKey(LocalFileKeys.ID, id, file);
    return files && files.length ? files[0] : null;
  }

  addFile(file: LocalFile): Promise<LocalFile | null> {
    return this.add(file);
  }
}

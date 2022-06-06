import { Pool } from 'pg';
import { entityQueryMapper } from './utils';
import { BaseEntity, table, ID } from '../models';
import { IBaseRepository } from '../base.repository';
import { makeQuery } from './utils';
import { DataResponseWrapper } from '../base.repository';

export class BasePostgresRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  constructor(protected pool: Pool, protected table: table) {
    (this.pool = pool), (this.table = table);
  }

  async getByKey(key: string, value: ID): Promise<DataResponseWrapper<T>> {
    return await makeQuery<T>(this.pool, {
      text: `SELECT * FROM ${this.table} WHERE ${key} = $1;`,
      values: [value as string],
    });
  }

  async add(e: T): Promise<DataResponseWrapper<T>> {
    const { cols, params, values } = entityQueryMapper(e);

    return await makeQuery<T>(this.pool, {
      text: `INSERT INTO ${this.table} (${cols.join(
        ',',
      )}) values (${params.join(',')});`,
      values,
    });
  }

  async deleteByKey(key: string, id: ID): Promise<DataResponseWrapper<T>> {
    return await makeQuery<T>(this.pool, {
      text: `DELETE FROM ${this.table} WHERE ${key} = $1;`,
      values: [id as string],
    });
  }

  async updateByKey(
    key: string,
    id: ID,
    e: Partial<T>,
  ): Promise<DataResponseWrapper<T>> {
    const { cols, values } = entityQueryMapper(e);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 1}`).join(',');

    return await makeQuery<T>(this.pool, {
      text: `UPDATE ${this.table} SET ${colsToUpdate} WHERE ${key} = '${id}';`,
      values,
    });
  }
}

import { entityQueryMapper } from './utils';
import { BaseEntity, table } from '../models';
import { IBaseRepository } from '../base.repository';
import { makeQuery } from './utils';
import { PostgresPool } from './postgresConnection.provider';

export class BasePostgresRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  constructor(protected pool: PostgresPool, protected table: table) {}

  async getByKey(key: string, value: any): Promise<T[] | null> {
    const data = await makeQuery<T>(this.pool, {
      text: `SELECT * FROM ${this.table} WHERE ${key} = $1;`,
      values: [value as string],
    });
    return data ? data : null;
  }

  async add(entity: T): Promise<T | null> {
    const { cols, params, values } = entityQueryMapper(entity);

    const data = await makeQuery<T>(this.pool, {
      text: `INSERT INTO ${this.table} (${cols.join(
        ',',
      )}) values (${params.join(',')}) RETURNING *;`,
      values,
    });
    return data && data.length ? data[0] : null;
  }

  async deleteByKey(key: string, value: any): Promise<T[] | null> {
    const data = await makeQuery<T>(this.pool, {
      text: `DELETE FROM ${this.table} WHERE ${key} = $1 RETURNING *;`,
      values: [value as string],
    });
    return data ? data : null;
  }

  async updateByKey(
    key: string,
    value: any,
    entity: Partial<T>,
  ): Promise<T[] | null> {
    const { cols, values } = entityQueryMapper(entity);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 1}`).join(',');

    const data = await makeQuery<T>(this.pool, {
      text: `UPDATE ${this.table} SET ${colsToUpdate} WHERE ${key} = '${value}' RETURNING *;`,
      values,
    });
    return data ? data : null;
  }
}

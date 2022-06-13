import { entityQueryMapper } from './utils';
import { BaseEntity, table, ID } from '../models';
import { IBaseRepository } from '../base.repository';
import { makeQuery } from './utils';
import { PostgresPool } from './postgresConnection.provider';

export class BasePostgresRepository<T extends BaseEntity>
  implements IBaseRepository<T>
{
  constructor(protected pool: PostgresPool, protected table: table) {}

  async getByKey(key: string, value: ID): Promise<T | null> {
    const data = await makeQuery<T>(this.pool, {
      text: `SELECT * FROM ${this.table} WHERE ${key} = $1;`,
      values: [value as string],
    });
    return data ? data[0] : null;
  }

  async add(e: T): Promise<T | null> {
    const { cols, params, values } = entityQueryMapper(e);

    const data = await makeQuery<T>(this.pool, {
      text: `INSERT INTO ${this.table} (${cols.join(
        ',',
      )}) values (${params.join(',')}) RETURNING *;`,
      values,
    });
    return data ? data[0] : null;
  }

  async deleteByKey(key: string, id: ID): Promise<T | null> {
    const data = await makeQuery<T>(this.pool, {
      text: `DELETE FROM ${this.table} WHERE ${key} = $1 RETURNING *;`,
      values: [id as string],
    });
    return data ? data[0] : null;
  }

  async updateByKey(key: string, id: ID, e: Partial<T>): Promise<T | null> {
    const { cols, values } = entityQueryMapper(e);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 1}`).join(',');

    const data = await makeQuery<T>(this.pool, {
      text: `UPDATE ${this.table} SET ${colsToUpdate} WHERE ${key} = '${id}' RETURNING *;`,
      values,
    });
    return data ? data[0] : null;
  }
}

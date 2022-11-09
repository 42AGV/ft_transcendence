import { entityQueryMapper } from './utils';
import { table } from '../models';
import { IBaseRepository } from '../base.repository';
import { makeQuery } from './utils';
import { PostgresPool } from './postgresConnection.provider';
import { PoolClient } from 'pg';

export interface EntityConstructor<T> {
  new (...args: any[]): T;
}
export class BasePostgresRepository<T> implements IBaseRepository<T> {
  constructor(
    protected pool: PostgresPool,
    protected table: table,
    protected ctor: EntityConstructor<T>,
  ) {}

  async getByKey(key: string, value: any): Promise<T[] | null> {
    const entitiesData = await makeQuery<T>(this.pool, {
      text: `SELECT * FROM ${this.table} WHERE ${key} = $1;`,
      values: [value],
    });
    return entitiesData
      ? entitiesData.map((data) => new this.ctor(data))
      : null;
  }

  async add(entity: Partial<T>): Promise<T | null> {
    const { cols, params, values } = entityQueryMapper(entity);

    const entitiesData = await makeQuery<T>(this.pool, {
      text: `INSERT INTO ${this.table} (${cols.join(
        ',',
      )}) values (${params.join(',')}) RETURNING *;`,
      values,
    });
    return entitiesData && entitiesData.length
      ? new this.ctor(entitiesData[0])
      : null;
  }

  async deleteByKey(key: string, value: any): Promise<T[] | null> {
    const entitiesData = await makeQuery<T>(this.pool, {
      text: `DELETE FROM ${this.table} WHERE ${key} = $1 RETURNING *;`,
      values: [value],
    });
    return entitiesData
      ? entitiesData.map((entity) => new this.ctor(entity))
      : null;
  }

  async updateByKey(
    key: string,
    value: any,
    entity: Partial<T>,
  ): Promise<T[] | null> {
    const { cols, values } = entityQueryMapper(entity);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 2}`).join(',');

    const entitiesData = await makeQuery<T>(this.pool, {
      text: `UPDATE ${this.table} SET ${colsToUpdate} WHERE ${key} = $1 RETURNING *;`,
      values: [value, ...values],
    });
    return entitiesData
      ? entitiesData.map((entity) => new this.ctor(entity))
      : null;
  }

  async insertWithClient<EntityData extends Record<string, any>>(
    client: PoolClient,
    table: table,
    entity: Partial<EntityData>,
  ) {
    const { cols, params, values } = entityQueryMapper(entity);
    const text = `INSERT INTO ${table}(${cols.join(
      ', ',
    )}) VALUES (${params.join(',')}) RETURNING *;`;
    return client.query(text, values);
  }
  async updateByIdWithClient<EntityData extends Record<string, any>>(
    client: PoolClient,
    table: table,
    id: string,
    entity: Partial<EntityData>,
  ) {
    const { cols, values } = entityQueryMapper(entity);
    const colsToUpdate = cols.map((col, i) => `${col}=$${i + 2}`).join(',');
    const text = `UPDATE ${table} SET ${colsToUpdate} WHERE "id"=$1 RETURNING *;`;
    return client.query(text, [id, ...values]);
  }
}

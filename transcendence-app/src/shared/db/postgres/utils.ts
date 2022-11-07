import { Logger } from '@nestjs/common';
import { DatabaseError, PoolClient } from 'pg';
import { Query, MappedQuery, table } from '../models';
import { PostgresPool } from './postgresConnection.provider';

const PostgresLogger = new Logger('Database');

export const entityQueryMapper = <T extends Record<string, any>>(
  entity: T,
): MappedQuery => {
  return Object.entries(entity).reduce<MappedQuery>(
    (mappedQuery, [key, value], index) => {
      if (value !== undefined) {
        mappedQuery.cols.push(`"${key}"`);
        mappedQuery.params.push(`$${index + 1}`);
        mappedQuery.values.push(value);
      }
      return mappedQuery;
    },
    { cols: [], params: [], values: [] },
  );
};

export const makeQuery = async <T>(
  pool: PostgresPool,
  query: Query,
): Promise<T[] | null> => {
  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (err) {
    if (isCriticalDatabaseError(err)) {
      PostgresLogger.error(err.message);
    }
    return null;
  }
};

export function insertWithClient<T extends Record<string, any>>(
  client: PoolClient,
  table: table,
  entity: T,
) {
  const { cols, params, values } = entityQueryMapper(entity);
  const text = `INSERT INTO ${table}(${cols.join(', ')}) VALUES (${params.join(
    ',',
  )}) RETURNING *;`;
  return client.query(text, values);
}
export function updateByIdWithClient<T extends Record<string, any>>(
  client: PoolClient,
  table: table,
  id: string,
  chatroom: T,
) {
  const { cols, values } = entityQueryMapper(chatroom);
  const colsToUpdate = cols.map((col, i) => `${col}=$${i + 2}`).join(',');
  const text = `UPDATE ${table} SET ${colsToUpdate} WHERE "id"=$1 RETURNING *;`;
  return client.query(text, [id, ...values]);
}

export function isCriticalDatabaseError(err: unknown): err is DatabaseError {
  return (
    err instanceof DatabaseError &&
    (err.severity === 'FATAL' || err.severity === 'PANIC')
  );
}

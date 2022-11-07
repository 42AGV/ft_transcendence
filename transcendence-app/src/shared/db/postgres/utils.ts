import { Logger } from '@nestjs/common';
import { DatabaseError, PoolClient } from 'pg';
import { Query, MappedQuery } from '../models';
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

export const makeTransactionalQuery = async <T>(
  pool: PostgresPool,
  callback: (client: PoolClient) => Promise<T | null>,
) => {
  let data: T | null = null;
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      data = await callback(client);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    return data;
  } catch (err) {
    if (isCriticalDatabaseError(err)) {
      PostgresLogger.error(err.message);
    }
    return null;
  }
};

export function isCriticalDatabaseError(err: unknown): err is DatabaseError {
  return (
    err instanceof DatabaseError &&
    (err.severity === 'FATAL' || err.severity === 'PANIC')
  );
}

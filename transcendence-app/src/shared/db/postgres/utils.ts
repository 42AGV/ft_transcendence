import { Logger } from '@nestjs/common';
import { DatabaseError } from 'pg';
import { BaseEntity, Query, MappedQuery } from '../models';
import { PostgresPool } from './postgresConnection.provider';

const PostgresLogger = new Logger('Database');

export const entityQueryMapper = (entity: Partial<BaseEntity>): MappedQuery => {
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

export function isCriticalDatabaseError(err: unknown): err is DatabaseError {
  return (
    err instanceof DatabaseError &&
    (err.severity === 'FATAL' || err.severity === 'PANIC')
  );
}

import { Logger } from '@nestjs/common';
import { BaseEntity, Query, MappedQuery } from '../models';
import { PostgresPool } from './postgresConnection.provider';

export const entityQueryMapper = (entity: Partial<BaseEntity>): MappedQuery => {
  return Object.entries(entity).reduce<MappedQuery>(
    (mappedQuery, [key, value], index) => {
      if (value !== undefined) {
        mappedQuery.cols.push(key);
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
  } catch (e: any) {
    Logger.error(e.message);
    return null;
  }
};

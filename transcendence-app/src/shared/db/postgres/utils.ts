import { BaseEntity, Query, MappedQuery } from '../models';
import { PostgresPool } from './postgresConnection.provider';

export const entityQueryMapper = (entity: Partial<BaseEntity>): MappedQuery => {
  return Object.keys(entity).reduce<MappedQuery>(
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
    return res?.rows?.length ? (res.rows as T[]) : null;
  } catch (e) {
    // TODO temp solution until we implement logging
    throw new Error(stringifyPostgresError(e));
  }
};

const stringifyPostgresError = (err: any): string => {
  const unkownError = 'unknown error';
  const severity = err?.severity ?? null;
  const code = err?.code ?? null;
  const detail = err?.detail ?? null;

  if (!severity || !code || !detail) {
    return unkownError;
  }
  return `${severity}: ${code}, ${detail}`;
};

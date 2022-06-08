import { BaseEntity, Query, MappedQuery } from '../models';
import { QueryResult } from 'pg';
import { DataResponseWrapper } from '../base.repository';
import { PostgresPool } from './postgresConnection.provider';

export const entityQueryMapper = (entity: Partial<BaseEntity>): MappedQuery => {
  const args = Object.entries(entity).filter(
    ([, value]) => value !== null && value !== undefined,
  );

  return {
    cols: args.map(([key]) => key),
    params: args.map((el, i) => `$${i + 1}`),
    values: args.map(([, value]) => value as string),
  };
};

export const makeQuery = async <T>(
  pool: PostgresPool,
  query: Query,
): Promise<DataResponseWrapper<T>> => {
  const client = await pool.connect();
  try {
    const res = await client.query(query);
    return buildWrappedResponse(res);
  } catch (e) {
    return buildWrappedResponse(null, e);
  } finally {
    client.release();
  }
};

const buildWrappedResponse = <T>(
  res?: QueryResult | null,
  error?: any,
): DataResponseWrapper<T> => ({
  data: res?.rows as T[],
  entries: res?.rowCount ?? null,
  error: error ? stringifyPostgresError(error) : null,
});

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

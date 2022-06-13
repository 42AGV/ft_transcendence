import { ID } from './models';

export type DataResponseWrapper<T> = {
  data: T[] | null;
  entries: number | null;
  error: string | null;
};

export interface IBaseRepository<T> {
  getByKey(key: string, id: ID): Promise<T | null>;
  deleteByKey(key: string, id: ID): Promise<T | null>;
  add(e: T): Promise<T | null>;
  updateByKey(key: string, id: ID, e: Partial<T>): Promise<T | null>;
}

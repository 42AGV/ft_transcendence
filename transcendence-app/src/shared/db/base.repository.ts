import { ID } from './models';

export type DataResponseWrapper<T> = {
  data: T[] | null;
  entries: number | null;
  error: string | null;
};

export interface IBaseRepository<T> {
  getByKey(key: string, id: ID): Promise<DataResponseWrapper<T>>;
  deleteByKey(key: string, id: ID): Promise<DataResponseWrapper<T>>;
  add(e: T): Promise<DataResponseWrapper<T>>;
  updateByKey(
    key: string,
    id: ID,
    e: Partial<T>,
  ): Promise<DataResponseWrapper<T>>;
}

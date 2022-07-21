import { ID } from './models';

export interface IBaseRepository<T> {
  getByKey(key: string, id: ID): Promise<T | null>;
  deleteByKey(key: string, id: ID): Promise<T | null>;
  add(entity: T): Promise<T | null>;
  updateByKey(key: string, id: ID, entity: Partial<T>): Promise<T | null>;
}

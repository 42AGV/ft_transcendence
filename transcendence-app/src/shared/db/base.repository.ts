export interface IBaseRepository<T> {
  getByKey(key: string, value: any): Promise<T[] | null>;
  deleteByKey(key: string, value: any): Promise<T[] | null>;
  add(entity: T): Promise<T | null>;
  updateByKey(key: string, value: any, entity: Partial<T>): Promise<T[] | null>;
}

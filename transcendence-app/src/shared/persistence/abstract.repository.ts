export abstract class IGenericRepository<T> {
  abstract create(item: T): Promise<T>;

  abstract find(id: string): Promise<T>;

  abstract update(id: string, item: T): Promise<T>;

  abstract delete(id: string, item: T): Promise<T>;
}

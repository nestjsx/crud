export interface CrudService<T> {
  create(entity: T): Promise<T>;
  getOne(id: number): Promise<T>;
  getAll(): Promise<T[]>;
  update(id: number, entity: T): Promise<T>;
  delete(id: number);
}

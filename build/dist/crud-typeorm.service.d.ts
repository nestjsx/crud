import { Repository } from 'typeorm';
import { CrudService } from './crud-service.interface';
export declare class CrudTypeOrmService<T> implements CrudService<T> {
    private readonly repository;
    constructor(repository: Repository<T>);
    save(entity: T): Promise<T>;
    create(entity: T): Promise<T>;
    getOne(id: number): Promise<T>;
    getAll(): Promise<T[]>;
    update(id: number, entity: T): Promise<T>;
    delete(id: number): Promise<void>;
}

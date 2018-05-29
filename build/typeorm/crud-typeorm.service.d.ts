import { Repository } from 'typeorm';
import { CrudService } from '../crud-service.interface';
export declare class CrudTypeOrmService<T> implements CrudService<T> {
    protected readonly repository: Repository<T>;
    constructor(repository: Repository<T>);
    protected save(entity: T): Promise<T>;
    protected getId(paramId: any): number;
    create(entity: T): Promise<T>;
    getOne(paramId: any): Promise<T>;
    getAll(): Promise<T[]>;
    update(paramId: any, entity: T): Promise<T>;
    delete(paramId: any): Promise<void>;
}

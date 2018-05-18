import { CrudService } from './crud-service.interface';
export declare class CrudController<T> {
    private readonly crudService;
    constructor(crudService: CrudService<T>);
    create(entity: T): Promise<T>;
    getOne(id: string): Promise<T>;
    getAll(): Promise<T[]>;
    update(id: string, entity: T): Promise<T>;
    delete(id: string): Promise<any>;
}

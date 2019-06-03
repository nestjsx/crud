import { CrudRequest, CreateManyDto } from '../interfaces';
export declare abstract class CrudService<T> {
    constructor();
    abstract getMany(req: CrudRequest): Promise<T[]>;
    abstract getOne(req: CrudRequest): Promise<T>;
    abstract createOne(req: CrudRequest, dto: T): Promise<T>;
    abstract createMany(req: CrudRequest, dto: CreateManyDto): Promise<T[]>;
    abstract updateOne(req: CrudRequest, dto: T): Promise<T>;
    abstract deleteOne(req: CrudRequest): Promise<void | T>;
}

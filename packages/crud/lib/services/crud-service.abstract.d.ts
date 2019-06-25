import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CrudRequest, CreateManyDto, GetManyDefaultResponse } from '../interfaces';
export declare abstract class CrudService<T> {
    constructor();
    abstract getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
    abstract getOne(req: CrudRequest): Promise<T>;
    abstract createOne(req: CrudRequest, dto: T): Promise<T>;
    abstract createMany(req: CrudRequest, dto: CreateManyDto): Promise<T[]>;
    abstract updateOne(req: CrudRequest, dto: T): Promise<T>;
    abstract replaceOne(req: CrudRequest, dto: T): Promise<T>;
    abstract deleteOne(req: CrudRequest): Promise<void | T>;
    throwBadRequestException(msg?: any): BadRequestException;
    throwNotFoundException(name: string): NotFoundException;
    createPageInfo(data: T[], total: number, limit: number, offset: number): GetManyDefaultResponse<T>;
}

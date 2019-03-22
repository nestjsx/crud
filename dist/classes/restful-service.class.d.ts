import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetManyDefaultResponse, RequestParamsParsed, RestfulOptions } from '../interfaces';
export declare abstract class RestfulService<T> {
    protected abstract options: RestfulOptions;
    constructor();
    createPageInfo(data: T[], total: number, limit: number, offset: number): GetManyDefaultResponse<T>;
    abstract decidePagination(query: RequestParamsParsed, mergedOptions: RestfulOptions): any;
    abstract getMany(...args: any[]): Promise<GetManyDefaultResponse<T> | T[]>;
    abstract getOne(...args: any[]): Promise<T>;
    abstract createOne(...args: any[]): Promise<T>;
    abstract createMany(...args: any[]): Promise<T[]>;
    abstract updateOne(...args: any[]): Promise<T>;
    abstract deleteOne(...args: any[]): Promise<void | T>;
    throwBadRequestException(msg?: any): BadRequestException;
    throwNotFoundException(name: string): NotFoundException;
}

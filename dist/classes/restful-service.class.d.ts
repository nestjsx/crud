import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RestfulOptions } from '../interfaces';
export declare abstract class RestfulService<T> {
    protected abstract options: RestfulOptions;
    constructor();
    abstract getMany(...args: any[]): Promise<T[]>;
    abstract getOne(...args: any[]): Promise<T>;
    abstract createOne(...args: any[]): Promise<T>;
    abstract createMany(...args: any[]): Promise<T[]>;
    throwBadRequestException(msg?: any): BadRequestException;
    throwNotFoundException(name?: string): NotFoundException;
}

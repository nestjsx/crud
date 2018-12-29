import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RestfulOptions } from '../interfaces';
export declare abstract class RestfulService<T> {
    protected abstract options: RestfulOptions;
    constructor();
    abstract getMany(...args: any[]): Promise<[T[], number]>;
    abstract getOne(...args: any[]): Promise<T>;
    abstract createOne(...args: any[]): Promise<T>;
    abstract createMany(...args: any[]): Promise<T[]>;
    abstract updateOne(...args: any[]): Promise<T>;
    abstract deleteOne(...args: any[]): Promise<void>;
    throwBadRequestException(msg?: any): BadRequestException;
    throwNotFoundException(name: string): NotFoundException;
}

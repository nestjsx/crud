import { ValidationPipeOptions } from '@nestjs/common';
import { ObjectLiteral } from './object-literal.interface';
import { RestfulOptions } from './restful-options.interface';
import { RestfulParamsDto } from '../dto/restful-params.dto';
import { RestfulService } from '../classes/restful-service.class';
export interface CrudController<S extends RestfulService<T>, T> {
    service: S;
    getManyBase?(params: ObjectLiteral, query: RestfulParamsDto): Promise<T[]>;
    getOneBase?(id: string, params: ObjectLiteral, query: RestfulParamsDto): Promise<T>;
    createOneBase?(params: ObjectLiteral, dto: T): Promise<T>;
    createManyBase?(params: ObjectLiteral, dto: EntitiesBulk<T>): Promise<T[]>;
    updateOneBase?(id: string, params: ObjectLiteral, dto: T): Promise<T>;
    deleteOneBase?(id: string, params: ObjectLiteral): Promise<void>;
}
export interface EntitiesBulk<T> {
    bulk: T[];
}
export interface CrudOptions {
    options?: RestfulOptions;
    params?: ObjectLiteral | string[];
    validation?: ValidationPipeOptions;
}

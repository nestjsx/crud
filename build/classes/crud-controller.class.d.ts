import { RequestParamsParsed } from '../interfaces';
import { ObjectLiteral } from '../interfaces/object-literal.interface';
import { RestfulService } from './restful-service.class';
export declare class CrudController<T> {
    protected service: RestfulService<T>;
    protected paramsFilter: string[] | ObjectLiteral;
    constructor(service: RestfulService<T>);
    getMany(query: RequestParamsParsed, params?: ObjectLiteral): Promise<T[]>;
    getOne(params: any, query: RequestParamsParsed): Promise<T>;
    createOne(): Promise<void>;
    createMany(): Promise<void>;
    updateOne(): Promise<void>;
    deleteOne(): Promise<void>;
    private getParamsFilter;
}

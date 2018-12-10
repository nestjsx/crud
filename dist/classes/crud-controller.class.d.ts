import { RequestParamsParsed } from '../interfaces';
import { ObjectLiteral } from '../interfaces/object-literal.interface';
import { RestfulService } from './restful-service.class';
export declare class CrudController<S extends RestfulService<T>, T> {
    protected service: S;
    protected paramsFilter: string[] | ObjectLiteral;
    constructor(service: S);
    getMany(query: RequestParamsParsed, params?: ObjectLiteral): Promise<T[]>;
    getOne(params: any, query: RequestParamsParsed): Promise<T>;
    createOne(): Promise<void>;
    createMany(): Promise<void>;
    updateOne(): Promise<void>;
    deleteOne(): Promise<void>;
    private getParamsFilter;
}

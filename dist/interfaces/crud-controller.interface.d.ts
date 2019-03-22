import { FilterParamParsed } from './request-parsed-params.interface';
import { CrudOptions } from './crud-options.interface';
import { GetManyDefaultResponse } from './get-many-default-response.interface';
import { RestfulParamsDto } from '../dto/restful-params.dto';
import { RestfulService } from '../classes/restful-service.class';
export interface CrudController<S extends RestfulService<T>, T> {
    service: S;
    getManyBase?(parsedQuery: RestfulParamsDto, parsedOptions: CrudOptions): Promise<GetManyDefaultResponse<T> | T[]>;
    getOneBase?(parsedQuery: RestfulParamsDto, parsedOptions: CrudOptions): Promise<T>;
    createOneBase?(parsedParams: FilterParamParsed[], dto: T): Promise<T>;
    createManyBase?(parsedParams: FilterParamParsed[], dto: EntitiesBulk<T>): Promise<T[]>;
    updateOneBase?(parsedParams: FilterParamParsed[], dto: T): Promise<T>;
    deleteOneBase?(parsedParams: FilterParamParsed[]): Promise<void | T>;
}
export interface EntitiesBulk<T> {
    bulk: T[];
}

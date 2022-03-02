import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { RequestQueryParser, SCondition } from '@nestjsx/crud-request';
import { CrudActions } from '../enums';
import { MergedCrudOptions, CrudRequest } from '../interfaces';
import { CrudBaseInterceptor } from './crud-base.interceptor';
export declare class CrudRequestInterceptor extends CrudBaseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
    getCrudRequest(parser: RequestQueryParser, crudOptions: Partial<MergedCrudOptions>): CrudRequest;
    getSearch(parser: RequestQueryParser, crudOptions: Partial<MergedCrudOptions>, action: CrudActions, params?: any): SCondition[];
    getParamsSearch(parser: RequestQueryParser, crudOptions: Partial<MergedCrudOptions>, params?: any): SCondition[];
    getAuth(parser: RequestQueryParser, crudOptions: Partial<MergedCrudOptions>, req: any): {
        filter?: any;
        or?: any;
    };
}

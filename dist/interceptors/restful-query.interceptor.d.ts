import { NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RestfulQueryInterceptor implements NestInterceptor {
    private delim;
    private delimStr;
    private reservedFields;
    intercept(context: ExecutionContext, call$: Observable<any>): Observable<any>;
    private transform;
    private splitString;
    private parseInt;
    private parseFilter;
    private parseSort;
    private parseJoin;
    private parseArray;
    private parseEntityFields;
}

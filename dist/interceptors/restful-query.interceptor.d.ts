import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class RestfulQueryInterceptor implements NestInterceptor {
    private delim;
    private delimStr;
    private reservedFields;
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
    private transform;
    private splitString;
    private parseInt;
    private parseFilter;
    private parseSort;
    private parseJoin;
    private parseArray;
    private parseEntityFields;
}

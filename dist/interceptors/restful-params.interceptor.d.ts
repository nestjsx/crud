import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class RestfulParamsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Promise<import("rxjs").Observable<any>>;
    private transform;
    private validate;
    private parseOptions;
}

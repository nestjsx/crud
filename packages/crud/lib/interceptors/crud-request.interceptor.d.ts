import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
export declare class CrudRequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
}

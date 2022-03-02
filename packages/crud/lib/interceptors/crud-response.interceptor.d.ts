import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CrudBaseInterceptor } from './crud-base.interceptor';
export declare class CrudResponseInterceptor extends CrudBaseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    protected transform(dto: any, data: any): any;
    protected serialize(context: ExecutionContext, data: any): any;
}

import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>) {
    console.log('LogInterceptor -----------');

    return call$;
  }
}

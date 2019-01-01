import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Response<T> {
    data: T;
}

@Injectable()
export class GetManyResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, call$: Observable<any>) {
        return call$.pipe(
            map((data: Array<any>) => {
                debugger
                const query = context.switchToHttp().getRequest().query;
                const total = data[1];
                const limit = query.limit ? query.limit : total;
                const page = query.page ? query.page : 1;
                const startRange = (page - 1) * limit;
                const endRange = startRange + data[0].length;
                context.switchToHttp().getResponse().set('Content-Range', `${startRange}-${endRange}/${total}`)
                return data[0]
            })
        );
    }
}
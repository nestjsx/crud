import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestQueryParser } from '@nestjsx/request-query/lib/request-query.parser';

import { R } from '../crud/reflection.helper';

@Injectable()
export class CrudRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const controller = context.getClass();
    const crudOptions = R.getCrudOptions(controller);

    const query = RequestQueryParser.create()
      .parseParams(req.params, crudOptions.params)
      .parseQuery(req.query);

    return next.handle();
  }
}

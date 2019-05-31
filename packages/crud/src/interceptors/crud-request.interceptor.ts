import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestQueryParser } from '@nestjsx/crud-request/lib/request-query.parser';

import { R } from '../crud/reflection.helper';
import { PARSED_CRUD_REQUEST_KEY } from '../constants';

@Injectable()
export class CrudRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const controller = context.getClass();
    const options = R.getCrudOptions(controller);

    const parsed = RequestQueryParser.create()
      .parseParams(req.params, options.params)
      .parseQuery(req.query)
      .getParsed();

    req[PARSED_CRUD_REQUEST_KEY] = { ...parsed, options };

    return next.handle();
  }
}

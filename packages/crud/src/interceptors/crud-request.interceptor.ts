import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestQueryParser } from '@nestjsx/crud-request';

import { PARSED_CRUD_REQUEST_KEY } from '../constants';
import { R } from '../crud/reflection.helper';
import { CrudRequest } from '../interfaces';

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

    const crudReq: CrudRequest = {
      parsed,
      options: {
        query: options.query,
        routes: options.routes,
        params: options.params,
      },
    };

    req[PARSED_CRUD_REQUEST_KEY] = crudReq;

    return next.handle();
  }
}

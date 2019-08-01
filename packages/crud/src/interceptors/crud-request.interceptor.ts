import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { RequestQueryParser } from '@nestjsx/crud-request';
import * as deepmerge from 'deepmerge';
import { PARSED_CRUD_REQUEST_KEY } from '../constants';
import { R } from '../crud/reflection.helper';
import { CrudRequest, CrudRequestOptions } from '../interfaces';

@Injectable()
export class CrudRequestInterceptor implements NestInterceptor {
  constructor(@Optional() private options: CrudRequestOptions = {}) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    /* istanbul ignore else */
    if (!req[PARSED_CRUD_REQUEST_KEY]) {
      const controller = context.getClass();
      const options = deepmerge(R.getCrudOptions(controller) || {}, this.options, {
        clone: true,
      });
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
    }

    return next.handle();
  }
}

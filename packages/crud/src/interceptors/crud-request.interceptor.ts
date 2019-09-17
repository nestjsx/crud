import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestQueryParser } from '@nestjsx/crud-request';
import { PARSED_CRUD_REQUEST_KEY } from '../constants';
import { R } from '../crud/reflection.helper';
import { CrudRequest, CrudRequestOptions } from '../interfaces';

const emptyOptions: CrudRequestOptions = {
  query: {},
  routes: {},
  params: {},
  customOperators: {},
};

@Injectable()
export class CrudRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    /* istanbul ignore else */
    if (!req[PARSED_CRUD_REQUEST_KEY]) {
      const controller = context.getClass();

      const controllerOptions = R.getCrudOptions(controller);
      const isDetached = !controllerOptions;
      const options = isDetached ? emptyOptions : controllerOptions;
      const parser = RequestQueryParser.create();
      if (!isDetached) {
        parser.parseParams(req.params, options.params);
      }
      const parsed = parser.parseQuery(req.query, options.customOperators).getParsed();

      const crudReq: CrudRequest = {
        parsed,
        options: {
          query: options.query,
          routes: options.routes,
          params: options.params,
          customOperators: options.customOperators,
        },
      };

      req[PARSED_CRUD_REQUEST_KEY] = crudReq;
    }

    return next.handle();
  }
}

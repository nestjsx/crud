import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestQueryParser } from '@nestjsx/crud-request';
import { isIn, isNil, isFunction, isObject } from '@nestjsx/util';

import { PARSED_CRUD_REQUEST_KEY } from '../constants';
import { R } from '../crud/reflection.helper';
import { MergedCrudOptions, CrudRequest, AuthOptions } from '../interfaces';

@Injectable()
export class CrudRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    /* istanbul ignore else */
    if (!req[PARSED_CRUD_REQUEST_KEY]) {
      const ctrl = context.getClass();
      const ctrlOptions = R.getCrudOptions(ctrl);
      const crudOptions = this.getCrudOptions(ctrlOptions);
      const parser = RequestQueryParser.create();

      parser.parseQuery(req.query);

      /* istanbul ignore else */
      if (!isNil(ctrlOptions)) {
        parser.parseParams(req.params, crudOptions.params);
        this.handleAuthorized(req, crudOptions.auth, parser);
      }

      req[PARSED_CRUD_REQUEST_KEY] = this.getCrudRequest(parser, crudOptions);
    }

    return next.handle();
  }

  getCrudOptions(controllerOptions: MergedCrudOptions): Partial<MergedCrudOptions> {
    return controllerOptions
      ? controllerOptions
      : {
          query: {},
          routes: {},
          params: {},
        };
  }

  getCrudRequest(
    parser: RequestQueryParser,
    crudOptions: Partial<MergedCrudOptions>,
  ): CrudRequest {
    const parsed = parser.getParsed();
    const { query, routes, params } = crudOptions;

    return {
      parsed,
      options: {
        query,
        routes,
        params,
      },
    };
  }

  handleAuthorized(req: any, authOptions: AuthOptions, parser: RequestQueryParser) {
    /* istanbul ignore else */
    if (isObject(authOptions)) {
      const hasFilter = isFunction(authOptions.filter);
      const hasPersist = isFunction(authOptions.persist);

      /* istanbul ignore else */
      if (hasFilter || hasPersist) {
        const { method } = req;
        const userOrRequest = authOptions.property ? req[authOptions.property] : req;

        /* istanbul ignore else */
        if (isIn(method, ['GET', 'PATCH', 'PUT', 'DELETE']) && hasFilter) {
          parser.setAuthFilter(authOptions.filter(userOrRequest));
        }

        /* istanbul ignore else */
        if (isIn(method, ['PATCH', 'PUT', 'POST']) && hasPersist) {
          parser.setAuthPersist(authOptions.persist(userOrRequest));
        }
      }
    }
  }
}

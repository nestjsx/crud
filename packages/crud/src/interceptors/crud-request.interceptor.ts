import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestQueryParser, SCondition, QueryFilter } from '@nestjsx/crud-request';
import { isIn, isNil, isFunction, isObject, isArrayFull, hasLength } from '@nestjsx/util';

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

      if (!isNil(ctrlOptions)) {
        const requestSearch = this.getRequestSearch(parser);
        const optionsFilterSearch = this.getOptionsFilterSearch(parser, crudOptions);
        const paramsSearch = this.getParamsSearch(parser, crudOptions, req.params);
        const auth = this.getAuth(parser, crudOptions, req);
        parser.search = auth.or
          ? {
              $or: [
                auth.or,
                {
                  $and: [optionsFilterSearch, paramsSearch, requestSearch],
                },
              ],
            }
          : {
              $and: [auth.filter, optionsFilterSearch, paramsSearch, requestSearch],
            };
      } else {
        parser.search = this.getRequestSearch(parser);
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

  getRequestSearch(parser: RequestQueryParser): SCondition {
    if (parser.search) {
      return parser.search;
    }

    if (hasLength(parser.filter) && hasLength(parser.or)) {
      return parser.filter.length === 1 && parser.or.length === 1
        ? {
            $or: [
              parser.convertFilterToSearch(parser.filter[0]),
              parser.convertFilterToSearch(parser.or[0]),
            ],
          }
        : {
            $or: [
              { $and: parser.filter.map(parser.convertFilterToSearch) },
              { $and: parser.or.map(parser.convertFilterToSearch) },
            ],
          };
    } else if (hasLength(parser.filter)) {
      return {
        $and: parser.filter.map(parser.convertFilterToSearch),
      };
    } else if (hasLength(parser.or)) {
      return parser.or.length === 1
        ? {
            $and: [parser.convertFilterToSearch(parser.or[0])],
          }
        : {
            $or: parser.or.map(parser.convertFilterToSearch),
          };
    }

    return {};
  }

  getOptionsFilterSearch(
    parser: RequestQueryParser,
    crudOptions: Partial<MergedCrudOptions>,
  ): SCondition {
    return isArrayFull(crudOptions.query.filter)
      ? {
          $and: (crudOptions.query.filter as QueryFilter[]).map(
            parser.convertFilterToSearch,
          ),
        }
      : (crudOptions.query.filter as SCondition) || {};
  }

  getParamsSearch(
    parser: RequestQueryParser,
    crudOptions: Partial<MergedCrudOptions>,
    params: any,
  ): SCondition {
    parser.parseParams(params, crudOptions.params);

    return isArrayFull(parser.paramsFilter)
      ? { $and: parser.paramsFilter.map(parser.convertFilterToSearch) }
      : {};
  }

  getAuth(
    parser: RequestQueryParser,
    crudOptions: Partial<MergedCrudOptions>,
    req: any,
  ): { filter?: any; or?: any } {
    let auth: any = {};

    if (crudOptions.auth) {
      const userOrRequest = crudOptions.auth.property
        ? req[crudOptions.auth.property]
        : req;

      if (isFunction(crudOptions.auth.or)) {
        auth.or = crudOptions.auth.or(userOrRequest);
      }

      if (isFunction(crudOptions.auth.filter) && !auth.or) {
        auth.filter = crudOptions.auth.filter(userOrRequest) || {};
      }

      if (isFunction(crudOptions.auth.persist)) {
        parser.setAuthPersist(crudOptions.auth.persist(userOrRequest));
      }
    }

    return auth;
  }
}

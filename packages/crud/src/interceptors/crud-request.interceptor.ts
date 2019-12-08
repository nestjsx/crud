import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestQueryParser, SCondition, QueryFilter } from '@nestjsx/crud-request';
import { isNil, isFunction, isArrayFull, hasLength } from '@nestjsx/util';

import { PARSED_CRUD_REQUEST_KEY } from '../constants';
import { CrudActions } from '../enums';
import { R } from '../crud/reflection.helper';
import { MergedCrudOptions, CrudRequest, AuthOptions } from '../interfaces';
import { QueryFilterFunction } from '../types';

@Injectable()
export class CrudRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    /* istanbul ignore else */
    if (!req[PARSED_CRUD_REQUEST_KEY]) {
      const ctrl = context.getClass();
      const handler = context.getHandler();
      const ctrlOptions = R.getCrudOptions(ctrl);
      const action = R.getAction(handler);
      const crudOptions = this.getCrudOptions(ctrlOptions);
      const parser = RequestQueryParser.create();

      parser.parseQuery(req.query);

      if (!isNil(ctrlOptions)) {
        const search = this.getSearch(parser, crudOptions, action, req.params);
        const auth = this.getAuth(parser, crudOptions, req);
        parser.search = auth.or
          ? { $or: [auth.or, { $and: search }] }
          : { $and: [auth.filter, ...search] };
      } else {
        parser.search = { $and: this.getSearch(parser, crudOptions, action) };
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

  getSearch(
    parser: RequestQueryParser,
    crudOptions: Partial<MergedCrudOptions>,
    action: CrudActions,
    params?: any,
  ): SCondition[] {
    // params condition
    const paramsSearch = this.getParamsSearch(parser, crudOptions, params);

    // if `CrudOptions.query.filter` is a function then return transformed query search conditions
    if (isFunction(crudOptions.query.filter)) {
      const filterCond =
        (crudOptions.query.filter as QueryFilterFunction)(
          parser.search,
          action === CrudActions.ReadAll,
        ) || {};

      return [...paramsSearch, filterCond];
    }

    // if `CrudOptions.query.filter` is array or search condition type
    const optionsFilter = isArrayFull(crudOptions.query.filter)
      ? (crudOptions.query.filter as QueryFilter[]).map(parser.convertFilterToSearch)
      : [(crudOptions.query.filter as SCondition) || {}];

    let search: SCondition[] = [];

    if (parser.search) {
      search = [parser.search];
    } else if (hasLength(parser.filter) && hasLength(parser.or)) {
      search =
        parser.filter.length === 1 && parser.or.length === 1
          ? [
              {
                $or: [
                  parser.convertFilterToSearch(parser.filter[0]),
                  parser.convertFilterToSearch(parser.or[0]),
                ],
              },
            ]
          : [
              {
                $or: [
                  { $and: parser.filter.map(parser.convertFilterToSearch) },
                  { $and: parser.or.map(parser.convertFilterToSearch) },
                ],
              },
            ];
    } else if (hasLength(parser.filter)) {
      search = parser.filter.map(parser.convertFilterToSearch);
    } else {
      if (hasLength(parser.or)) {
        search =
          parser.or.length === 1
            ? [parser.convertFilterToSearch(parser.or[0])]
            : [
                {
                  $or: parser.or.map(parser.convertFilterToSearch),
                },
              ];
      }
    }

    return [...paramsSearch, ...optionsFilter, ...search];
  }

  getParamsSearch(
    parser: RequestQueryParser,
    crudOptions: Partial<MergedCrudOptions>,
    params?: any,
  ): SCondition[] {
    if (params) {
      parser.parseParams(params, crudOptions.params);

      return isArrayFull(parser.paramsFilter)
        ? parser.paramsFilter.map(parser.convertFilterToSearch)
        : [];
    }

    return [];
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

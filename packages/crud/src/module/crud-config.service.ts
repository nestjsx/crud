import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { isObjectFull } from '@nestjsx/util';
import * as deepmerge from 'deepmerge';

import { CrudGlobalConfig } from '../interfaces';

export class CrudConfigService {
  static config: CrudGlobalConfig = {
    auth: {},
    query: {},
    routes: {
      getManyBase: { interceptors: [], decorators: [] },
      getOneBase: { interceptors: [], decorators: [] },
      createOneBase: { interceptors: [], decorators: [] },
      createManyBase: { interceptors: [], decorators: [] },
      updateOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      replaceOneBase: {
        interceptors: [],
        decorators: [],
        allowParamsOverride: false,
        returnShallow: false,
      },
      deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
    },
    params: {},
  };

  static load(config: CrudGlobalConfig = {}) {
    if (isObjectFull(config.queryParser)) {
      RequestQueryBuilder.setOptions(config.queryParser);
    }

    const auth = isObjectFull(config.auth) ? config.auth : {};
    const query = isObjectFull(config.query) ? config.query : {};
    const routes = isObjectFull(config.routes) ? config.routes : {};
    const params = isObjectFull(config.params) ? config.params : {};

    CrudConfigService.config = deepmerge(
      CrudConfigService.config,
      { auth, query, routes, params },
      { arrayMerge: (a, b, c) => b },
    );
  }
}

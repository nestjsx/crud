import { isObjectFull } from '@nestjsx/util';

import { CrudOptions } from '../interfaces';

export function setOptionsDefaults(options: CrudOptions, target: any) {
  // set default `id` numeric slug
  if (!isObjectFull(options.param)) {
    options.param = {
      id: {
        field: 'id',
        type: 'number',
      },
    };

    // set default routes options
    if (!isObjectFull(options.routes)) {
      options.routes = {};
    }
    if (!isObjectFull(options.routes.getManyBase)) {
      options.routes.getManyBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(options.routes.getOneBase)) {
      options.routes.getOneBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(options.routes.createOneBase)) {
      options.routes.createOneBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(options.routes.createManyBase)) {
      options.routes.createManyBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(options.routes.updateOneBase)) {
      options.routes.updateOneBase = {
        allowParamsOverride: false,
        interceptors: [],
        decorators: [],
      };
    }
    if (!isObjectFull(options.routes.deleteOneBase)) {
      options.routes.deleteOneBase = {
        returnDeleted: false,
        interceptors: [],
        decorators: [],
      };
    }
  }
}

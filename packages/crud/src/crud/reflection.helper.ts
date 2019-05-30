import { RequestMethod, ReflectMetadata } from '@nestjs/common';
import {
  CUSTOM_ROUTE_AGRS_METADATA,
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';

import { BaseRoute, CrudOptions } from '../interfaces';
import { CRUD_OPTIONS_METADATA } from '../constants';

export class R {
  static set(metadataKey: any, metadataValue: any, target: Object) {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }

  static get<T extends any>(metadataKey: any, target: Object): T {
    return Reflect.getMetadata(metadataKey, target);
  }

  static setCrudOptions(options: CrudOptions, target: any) {
    R.set(CRUD_OPTIONS_METADATA, options, target);
  }

  static setRoute(route: BaseRoute, func: Function) {
    R.set(PATH_METADATA, route.path, func);
    R.set(METHOD_METADATA, route.method, func);
  }

  static setInterceptors(interceptors: any[], func: Function) {
    R.set(INTERCEPTORS_METADATA, interceptors, func);
  }

  static getCrudOptions(target: any): CrudOptions {
    return R.get(CRUD_OPTIONS_METADATA, target);
  }
}

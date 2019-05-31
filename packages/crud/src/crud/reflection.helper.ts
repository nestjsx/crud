import { RequestMethod, ReflectMetadata } from '@nestjs/common';
import {
  CUSTOM_ROUTE_AGRS_METADATA,
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { isArrayFull } from '@nestjsx/util';

import { BaseRoute, CrudOptions } from '../interfaces';
import {
  CRUD_OPTIONS_METADATA,
  ACTION_NAME_METADATA,
  PARSED_CRUD_REQUEST_KEY,
} from '../constants';
import { CrudActions } from '../enums';

export class R {
  static set(
    metadataKey: any,
    metadataValue: any,
    target: Object,
    propertyKey: string | symbol = undefined,
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    } else {
      Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
  }

  static setCustomRouteDecorator(
    paramtype: string,
    index: number,
    pipes: any[] = [],
    data = undefined,
  ): any {
    return {
      [`${paramtype}${CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
        index,
        factory: (_, req) => req[paramtype],
        data,
        pipes,
      },
    };
  }

  static setParsedRequest(index: number) {
    return R.setCustomRouteDecorator(PARSED_CRUD_REQUEST_KEY, index);
  }

  static get<T extends any>(
    metadataKey: any,
    target: Object,
    propertyKey: string | symbol = undefined,
  ): T {
    return propertyKey
      ? Reflect.getMetadata(metadataKey, target, propertyKey)
      : Reflect.getMetadata(metadataKey, target);
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

  static setRouteArgs(metadata: any, target: any, name: string) {
    R.set(ROUTE_ARGS_METADATA, metadata, target, name);
  }

  static setAction(action: CrudActions, func: Function) {
    R.set(ACTION_NAME_METADATA, action, func);
  }

  static getCrudOptions(target: any): CrudOptions {
    return R.get(CRUD_OPTIONS_METADATA, target);
  }

  static getAction(func: Function): CrudActions {
    return R.get(ACTION_NAME_METADATA, func);
  }
}

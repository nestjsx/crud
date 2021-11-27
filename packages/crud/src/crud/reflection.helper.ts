import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  CUSTOM_ROUTE_AGRS_METADATA,
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { ArgumentsHost } from '@nestjs/common';
import { isFunction } from '@rewiko/util';

import { BaseRoute, MergedCrudOptions, AuthOptions } from '../interfaces';
import { BaseRouteName } from '../types';
import {
  CRUD_OPTIONS_METADATA,
  ACTION_NAME_METADATA,
  PARSED_CRUD_REQUEST_KEY,
  PARSED_BODY_METADATA,
  OVERRIDE_METHOD_METADATA,
  CRUD_AUTH_OPTIONS_METADATA,
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

  static get<T extends any>(
    metadataKey: any,
    target: Object,
    propertyKey: string | symbol = undefined,
  ): T {
    return propertyKey
      ? Reflect.getMetadata(metadataKey, target, propertyKey)
      : Reflect.getMetadata(metadataKey, target);
  }

  static createCustomRouteArg(
    paramtype: string,
    index: number,
    /* istanbul ignore next */
    pipes: any[] = [],
    data = undefined,
  ): any {
    return {
      [`${paramtype}${CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
        index,
        factory: (_, ctx) => R.getContextRequest(ctx)[paramtype],
        data,
        pipes,
      },
    };
  }

  static createRouteArg(
    paramtype: RouteParamtypes,
    index: number,
    /* istanbul ignore next */
    pipes: any[] = [],
    data = undefined,
  ): any {
    return {
      [`${paramtype}:${index}`]: {
        index,
        pipes,
        data,
      },
    };
  }

  static setDecorators(
    decorators: (PropertyDecorator | MethodDecorator)[],
    target: object,
    name: string,
  ) {
    // this makes metadata decorator works
    const decoratedDescriptor = Reflect.decorate(
      decorators,
      target,
      name,
      Reflect.getOwnPropertyDescriptor(target, name),
    );

    // this makes proxy decorator works
    Reflect.defineProperty(target, name, decoratedDescriptor);
  }

  static setParsedRequestArg(index: number) {
    return R.createCustomRouteArg(PARSED_CRUD_REQUEST_KEY, index);
  }

  static setBodyArg(index: number, /* istanbul ignore next */ pipes: any[] = []) {
    return R.createRouteArg(RouteParamtypes.BODY, index, pipes);
  }

  static setCrudOptions(options: MergedCrudOptions, target: any) {
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

  static setRouteArgsTypes(metadata: any, target: any, name: string) {
    R.set(PARAMTYPES_METADATA, metadata, target, name);
  }

  static setAction(action: CrudActions, func: Function) {
    R.set(ACTION_NAME_METADATA, action, func);
  }

  static setCrudAuthOptions(metadata: any, target: any) {
    R.set(CRUD_AUTH_OPTIONS_METADATA, metadata, target);
  }

  static getCrudAuthOptions(target: any): AuthOptions {
    return R.get(CRUD_AUTH_OPTIONS_METADATA, target);
  }

  static getCrudOptions(target: any): MergedCrudOptions {
    return R.get(CRUD_OPTIONS_METADATA, target);
  }

  static getAction(func: Function): CrudActions {
    return R.get(ACTION_NAME_METADATA, func);
  }

  static getOverrideRoute(func: Function): BaseRouteName {
    return R.get(OVERRIDE_METHOD_METADATA, func);
  }

  static getInterceptors(func: Function): any[] {
    return R.get(INTERCEPTORS_METADATA, func) || [];
  }

  static getRouteArgs(target: any, name: string): any {
    return R.get(ROUTE_ARGS_METADATA, target, name);
  }

  static getRouteArgsTypes(target: any, name: string): any[] {
    return R.get(PARAMTYPES_METADATA, target, name) || /* istanbul ignore next */ [];
  }

  static getParsedBody(func: Function): any {
    return R.get(PARSED_BODY_METADATA, func);
  }

  static getContextRequest(ctx: ArgumentsHost): any {
    return isFunction(ctx.switchToHttp)
      ? ctx.switchToHttp().getRequest()
      : /* istanbul ignore next */ ctx;
  }
}

import { RequestMethod, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  PATH_METADATA,
  METHOD_METADATA,
  INTERCEPTORS_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
} from '@nestjs/common/constants';

import { CrudActions, CrudValidate } from '../enums';
import { CrudOptions } from '../interfaces';
import { ACTION_NAME_METADATA, OVERRIDE_METHOD_METADATA } from '../constants';
import { swagger, hasValidator, hasTypeorm } from '../utils';

export function setRoute(path: string, method: RequestMethod, func: Function) {
  Reflect.defineMetadata(PATH_METADATA, path, func);
  Reflect.defineMetadata(METHOD_METADATA, method, func);
}

export function setParamTypes(args: any[], prototype: any, name: string) {
  Reflect.defineMetadata(PARAMTYPES_METADATA, args, prototype, name);
}

export function setParams(metadata: any, target: object, name: string) {
  Reflect.defineMetadata(ROUTE_ARGS_METADATA, metadata, target, name);
}

export function setInterceptors(interceptors: any[], func: Function) {
  Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, func);
}

export function setAction(action: CrudActions, func: Function) {
  Reflect.defineMetadata(ACTION_NAME_METADATA, action, func);
}

export function setSwaggerParams(func: Function, crudOptions: CrudOptions) {
  if (swagger && crudOptions.params) {
    const list = Array.isArray(crudOptions.params)
      ? crudOptions.params
      : Object.keys(crudOptions.params);

    if (list.length) {
      const params = list.map((name: string) => ({
        name,
        required: true,
        in: 'path',
        type: Number,
      }));

      setSwagger(params, func);
    }
  }
}

export function setSwaggerQueryGetOne(func: Function, name: string) {
  if (swagger) {
    const params = [
      {
        name: 'fields',
        description: `${name} fields`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'join',
        description: `Join relational entity with ${name}`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'cache',
        description: `Reset cached result`,
        required: false,
        in: 'query',
        type: Number,
      },
    ];

    setSwagger(params, func);
  }
}

export function setSwaggerQueryGetMany(func: Function, name: string) {
  if (swagger) {
    const params = [
      {
        name: 'fields',
        description: `${name} fields in the collection`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'filter',
        description: `Filter ${name} collection with condition`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'or',
        description: `Filter ${name} collection with condition (OR)`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'sort',
        description: `Sort ${name} collection by field and order`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'join',
        description: `Join relational entity with ${name}`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'limit',
        description: `Limit ${name} collection`,
        required: false,
        in: 'query',
        type: Number,
      },
      {
        name: 'offset',
        description: `Offset ${name} collection`,
        required: false,
        in: 'query',
        type: Number,
      },
      {
        name: 'page',
        description: `Set page of ${name} collection`,
        required: false,
        in: 'query',
        type: Number,
      },
      {
        name: 'cache',
        description: `Reset cached result`,
        required: false,
        in: 'query',
        type: Number,
      },
    ];

    setSwagger(params, func);
  }
}

export function createParamMetadata(
  paramtype: RouteParamtypes,
  index: number,
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

export function getOverrideMetadata(func: Function): string {
  return Reflect.getMetadata(OVERRIDE_METHOD_METADATA, func);
}

export function getInterceptors(func: Function): any[] {
  return Reflect.getMetadata(INTERCEPTORS_METADATA, func);
}

export function getAction(func: Function): CrudActions {
  return Reflect.getMetadata(ACTION_NAME_METADATA, func);
}

export function setValidationPipe(crudOptions: CrudOptions, group: CrudValidate) {
  const options = crudOptions.validation || {};

  return hasValidator
    ? new ValidationPipe({
        ...options,
        groups: [group],
        transform: false,
      })
    : undefined;
}

export function setParseIntPipe() {
  return hasTypeorm ? new ParseIntPipe() : undefined;
}

function setSwagger(params: any[], func: Function) {
  const metadata = Reflect.getMetadata(swagger.DECORATORS.API_PARAMETERS, func) || [];
  Reflect.defineMetadata(swagger.DECORATORS.API_PARAMETERS, [...metadata, ...params], func);
}

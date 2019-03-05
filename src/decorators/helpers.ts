import { RequestMethod, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  PATH_METADATA,
  METHOD_METADATA,
  INTERCEPTORS_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
  CUSTOM_ROUTE_AGRS_METADATA,
} from '@nestjs/common/constants';

import { CrudActions, CrudValidate } from '../enums';
import { CrudOptions } from '../interfaces';
import { BaseRouteName } from '../types';
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

export function setSwaggerOkResponse(func: Function, dto: any, isArray?: boolean) {
  if (swagger) {
    const responses = Reflect.getMetadata(swagger.DECORATORS.API_RESPONSE, func) || {};
    const groupedMetadata = {
      [200]: {
        type: dto,
        isArray,
        description: '',
      },
    };
    Reflect.defineMetadata(swagger.DECORATORS.API_RESPONSE, { ...responses, ...groupedMetadata }, func);
  }
}

export function setSwaggerOperation(func: Function, summary: string = '') {
  if (swagger) {
    const meta = Reflect.getMetadata(swagger.DECORATORS.API_OPERATION, func) || {};
    Reflect.defineMetadata(swagger.DECORATORS.API_OPERATION, Object.assign(meta, { summary }), func);
  }
}

export function setSwaggerParams(func: Function, crudOptions: CrudOptions) {
  if (swagger) {
    const params = Object.keys(crudOptions.params).map((key) => ({
      name: key,
      required: true,
      in: 'path',
      type: crudOptions.params[key] === 'number' ? Number : String,
    }));

    setSwagger(params, func);
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

export function createCustomRequestParamMetadata(
  paramtype: string,
  index: number,
  pipes: any[] = [],
  data = undefined,
): any {
  return {
    [`${paramtype}${CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
      index,
      factory: (data, req) => req[paramtype],
      data,
      pipes,
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

export function getControllerPath(target): string {
  return Reflect.getMetadata(PATH_METADATA, target);
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

// FIXME Due to issue https://github.com/nestjs/nest/issues/1604, someone can't use global parser pipe without modify ParseIntPipe
export function setParseIntPipe() {
  return hasTypeorm ? new ParseIntPipe() : undefined;
}

export function enableRoute(name: BaseRouteName, crudOptions: CrudOptions) {
  if (!crudOptions.routes) {
    return true;
  }

  if (crudOptions.routes.only && crudOptions.routes.only.length) {
    return crudOptions.routes.only.some((only) => only === name);
  }

  if (crudOptions.routes.exclude && crudOptions.routes.exclude.length) {
    return !crudOptions.routes.exclude.some((exclude) => exclude === name);
  }

  return true;
}

function setSwagger(params: any[], func: Function) {
  const metadata = Reflect.getMetadata(swagger.DECORATORS.API_PARAMETERS, func) || [];
  Reflect.defineMetadata(swagger.DECORATORS.API_PARAMETERS, [...metadata, ...params], func);
}

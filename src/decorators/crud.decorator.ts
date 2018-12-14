import { RequestMethod, ParseIntPipe, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  PATH_METADATA,
  METHOD_METADATA,
  INTERCEPTORS_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
} from '@nestjs/common/constants';

import { RestfulParamsDto } from '../dto';
import { CrudActions, CrudValidate } from '../enums';
import { RestfulQueryInterceptor } from '../interceptors';
import { FilterParamParsed, ObjectLiteral, EntitiesBulk } from '../interfaces';
import { ACTION_NAME_METADATA, OVERRIDE_METHOD_METADATA } from '../constants';
import {
  mockValidatorDecorator,
  mockTransformerDecorator,
  hasValidator,
  hasTypeorm,
} from '../utils';

interface BaseRoutes {
  [key: string]: {
    name: string;
    path: string;
    method: RequestMethod;
    override?: boolean;
  };
}

interface CrudOptions {
  validation?: ValidationPipeOptions;
}

export const Crud = (dto: any, crudOptions: CrudOptions = {}) => (target: object) => {
  const prototype = (target as any).prototype;
  const baseRoutes: BaseRoutes = {
    getManyBase: {
      name: 'getManyBase',
      path: '/',
      method: RequestMethod.GET,
    },
    getOneBase: {
      name: 'getOneBase',
      path: '/:id',
      method: RequestMethod.GET,
    },
    createOneBase: {
      name: 'createOneBase',
      path: '/',
      method: RequestMethod.POST,
    },
    createManyBase: {
      name: 'createManyBase',
      path: '/bulk',
      method: RequestMethod.POST,
    },
    updateOneBase: {
      name: 'updateOneBase',
      path: '/:id',
      method: RequestMethod.PATCH,
    },
    deleteOneBase: {
      name: 'deleteOneBase',
      path: '/:id',
      method: RequestMethod.DELETE,
    },
  };

  // set helpers
  getParamsFilter(prototype);
  getMergedOptions(prototype);
  // set routes
  getManyBase(target, baseRoutes.getManyBase.name);
  getOneBase(target, baseRoutes.getOneBase.name);
  createOneBase(target, baseRoutes.createOneBase.name, dto, crudOptions);
  createManyBase(target, baseRoutes.createManyBase.name, dto, crudOptions);
  updateOneBase(target, baseRoutes.updateOneBase.name, dto, crudOptions);
  deleteOneBase(target, baseRoutes.deleteOneBase.name);

  // method override
  Object.getOwnPropertyNames(prototype).forEach((name) => {
    const overrided = getOverrideMetadata(prototype[name]);
    const route = baseRoutes[overrided];

    if (overrided && route) {
      // get base function metadata
      const interceptors = getInterceptors(prototype[name]) || [];
      const baseInterceptors = getInterceptors(prototype[overrided]) || [];
      const baseAction = getAction(prototype[overrided]);

      // set metadata
      setInterceptors([...interceptors, ...baseInterceptors], prototype[name]);
      setAction(baseAction, prototype[name]);

      // set route
      setRoute(route.path, route.method, prototype[name]);
      route.override = true;
    }
  });

  // set routes for base functions
  Object.keys(baseRoutes).forEach((name) => {
    const route = baseRoutes[name];

    if (!route.override) {
      setRoute(route.path, route.method, prototype[route.name]);
    }
  });
};

export const Override = (
  name?: 'getManyBase' | 'getOneBase' | 'createOneBase' | 'updateOneBase' | 'deleteOneBase',
) => (target, key, descriptor: PropertyDescriptor) => {
  Reflect.defineMetadata(OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
  return descriptor;
};

// Base routes

/**
 * Get meny entities base route
 */
function getManyBase(target: object, name: string) {
  const prototype = (target as any).prototype;

  prototype[name] = function(params: ObjectLiteral, query: RestfulParamsDto) {
    const mergedOptions = this.getMergedOptions(params);

    return this.service.getMany(query, mergedOptions);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0),
      ...createParamMetadata(RouteParamtypes.QUERY, 1),
    },
    target,
    name,
  );
  setParamTypes([Object, RestfulParamsDto], prototype, name);
  setInterceptors([RestfulQueryInterceptor], prototype[name]);
  setAction(CrudActions.ReadAll, prototype[name]);
}

/**
 * Get one entity base route
 */

function getOneBase(target: object, name: string) {
  const prototype = (target as any).prototype;

  prototype[name] = function(id: string, params: ObjectLiteral, query: RestfulParamsDto) {
    const mergedOptions = this.getMergedOptions(params);

    return this.service.getOne(id, query, mergedOptions);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0, [setParseIntPipe()], 'id'),
      ...createParamMetadata(RouteParamtypes.PARAM, 1),
      ...createParamMetadata(RouteParamtypes.QUERY, 2),
    },
    target,
    name,
  );
  setParamTypes([Number, Object, RestfulParamsDto], prototype, name);
  setInterceptors([RestfulQueryInterceptor], prototype[name]);
  setAction(CrudActions.ReadOne, prototype[name]);
}

/**
 * Create one entity base route
 */

function createOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function(params: ObjectLiteral, body: any) {
    const paramsFilter = this.getParamsFilter(params);

    return this.service.createOne(body, paramsFilter);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0),
      ...createParamMetadata(RouteParamtypes.BODY, 1, [
        setValidationPipe(crudOptions, CrudValidate.CREATE),
      ]),
    },
    target,
    name,
  );
  setParamTypes([Object, dto], prototype, name);
  setAction(CrudActions.CreateOne, prototype[name]);
}

/**
 * Create many entities base route
 */
function createManyBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function(params: ObjectLiteral, body: any) {
    const paramsFilter = this.getParamsFilter(params);

    return this.service.createMany(body, paramsFilter);
  };

  const isArray = mockValidatorDecorator('isArray');
  const ValidateNested = mockValidatorDecorator('ValidateNested');
  const IsNotEmpty = mockValidatorDecorator('IsNotEmpty');
  const Type = mockTransformerDecorator('Type');

  class BulkDto implements EntitiesBulk<any> {
    @isArray({ each: true, groups: [CrudValidate.CREATE] })
    @IsNotEmpty({ groups: [CrudValidate.CREATE] })
    @ValidateNested({ each: true, groups: [CrudValidate.CREATE] })
    @Type((t) => dto)
    bulk: any[];
  }

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0),
      ...createParamMetadata(RouteParamtypes.BODY, 1, [
        setValidationPipe(crudOptions, CrudValidate.CREATE),
      ]),
    },
    target,
    name,
  );
  setParamTypes([Object, hasValidator ? BulkDto : {}], prototype, name);
  setAction(CrudActions.CreateMany, prototype[name]);
}

/**
 * Update one entity base route
 */
function updateOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function(id: string, params: ObjectLiteral, body) {
    const paramsFilter = this.getParamsFilter(params);

    return this.service.updateOne(id, body, paramsFilter);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0, [setParseIntPipe()], 'id'),
      ...createParamMetadata(RouteParamtypes.PARAM, 1),
      ...createParamMetadata(RouteParamtypes.BODY, 2, [
        setValidationPipe(crudOptions, CrudValidate.UPDATE),
      ]),
    },
    target,
    name,
  );
  setParamTypes([Number, Object, dto], prototype, name);
  setAction(CrudActions.UpdateOne, prototype[name]);
}

/**
 * Delete one entity route base
 */
function deleteOneBase(target: object, name: string) {
  const prototype = (target as any).prototype;

  prototype[name] = function(id: number, params: ObjectLiteral) {
    const paramsFilter = this.getParamsFilter(params);
    return this.service.deleteOne(id, paramsFilter);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0, [setParseIntPipe()], 'id'),
      ...createParamMetadata(RouteParamtypes.PARAM, 1),
    },
    target,
    name,
  );
  setParamTypes([Number, Object], prototype, name);
  setAction(CrudActions.DeleteOne, prototype[name]);
}

// Helpers

function getParamsFilter(prototype: any) {
  prototype['getParamsFilter'] = function(params: ObjectLiteral): FilterParamParsed[] {
    if (!this.paramsFilter || !params) {
      return [];
    }

    const isArray = Array.isArray(this.paramsFilter);

    return (isArray ? this.paramsFilter : Object.keys(this.paramsFilter))
      .filter((field) => !!params[field])
      .map(
        (field) =>
          ({
            field: isArray ? field : this.paramsFilter[field],
            operator: 'eq',
            value: params[field],
          } as FilterParamParsed),
      );
  };
}

function getMergedOptions(prototype: any) {
  prototype['getMergedOptions'] = function(params: ObjectLiteral) {
    const paramsFilter = this.getParamsFilter(params);
    const options = this.options || {};
    const optionsFilter = options.filter || [];

    return {
      ...options,
      filter: [...optionsFilter, ...paramsFilter],
    };
  };
}

// Metadata Setters

function setRoute(path: string, method: RequestMethod, func: Function) {
  Reflect.defineMetadata(PATH_METADATA, path, func);
  Reflect.defineMetadata(METHOD_METADATA, method, func);
}

function setParamTypes(args: any[], prototype: any, name: string) {
  Reflect.defineMetadata(PARAMTYPES_METADATA, args, prototype, name);
}

function setParams(metadata: any, target: object, name: string) {
  Reflect.defineMetadata(ROUTE_ARGS_METADATA, metadata, target, name);
}

function setInterceptors(interceptors: any[], func: Function) {
  Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, func);
}

function setAction(action: CrudActions, func: Function) {
  Reflect.defineMetadata(ACTION_NAME_METADATA, action, func);
}

// Metadata Getters

function createParamMetadata(
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

function getOverrideMetadata(func: Function): string {
  return Reflect.getMetadata(OVERRIDE_METHOD_METADATA, func);
}

function getInterceptors(func: Function): any[] {
  return Reflect.getMetadata(INTERCEPTORS_METADATA, func);
}

function getAction(func: Function): CrudActions {
  return Reflect.getMetadata(ACTION_NAME_METADATA, func);
}

// Pipes

function setValidationPipe(crudOptions: CrudOptions = {}, group: CrudValidate) {
  const options = crudOptions.validation || {};

  return hasValidator
    ? new ValidationPipe({
        ...options,
        groups: [group],
        transform: false,
      })
    : undefined;
}

function setParseIntPipe() {
  return hasTypeorm ? new ParseIntPipe() : undefined;
}

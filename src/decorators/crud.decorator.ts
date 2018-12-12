import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  PATH_METADATA,
  METHOD_METADATA,
  INTERCEPTORS_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
} from '@nestjs/common/constants';

import { RestfulParamsDto } from '../dto';
import { CrudActions } from '../enums';
import { RestfulQueryInterceptor } from '../interceptors';
import { FilterParamParsed, ObjectLiteral } from '../interfaces';
import { ACTION_NAME_METADATA, OVERRIDE_METHOD_METADATA } from '../constants';
import { mockValidatorDecorator, mockTransformerDecorator } from '../utils';

interface BaseRoutes {
  [key: string]: {
    name: string;
    path: string;
    method: RequestMethod;
    override?: boolean;
  };
}

export const Crud = (dto?: any) => (target: object) => {
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

  // set all base methods
  getOptions(prototype);
  getParamsFilter(prototype);
  getManyBase(target, baseRoutes.getManyBase.name);
  getOneBase(target, baseRoutes.getOneBase.name);
  createOneBase(target, baseRoutes.createOneBase.name, dto);
  createManyBase(target, baseRoutes.createManyBase.name, dto);
  updateOneBase(target, baseRoutes.updateOneBase.name, dto);
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

function getManyBase(target: object, name: string) {
  const prototype = (target as any).prototype;

  prototype[name] = function(query: RestfulParamsDto, params?: ObjectLiteral) {
    const filter = this.getParamsFilter(params);
    const options = this.getOptions();
    const merged = { ...options, filter: [...(options.filter ? options.filter : []), ...filter] };

    return this.service.getMany(query, merged);
  };

  setParams(
    {
      ...getParamMetadata(RouteParamtypes.QUERY, 0),
      ...getParamMetadata(RouteParamtypes.PARAM, 1),
    },
    target,
    name,
  );
  setParamTypes([RestfulParamsDto, Object], prototype, name);
  setInterceptors([RestfulQueryInterceptor], prototype[name]);
  setAction(CrudActions.ReadAll, prototype[name]);
}

function getOneBase(target: object, name: string) {
  const prototype = (target as any).prototype;

  prototype[name] = function(params: ObjectLiteral, query?: RestfulParamsDto) {
    const filter = this.getParamsFilter(params);
    const options = this.getOptions();
    const merged = { ...options, filter: [...(options.filter ? options.filter : []), ...filter] };

    return this.service.getOne(params.id, query, merged);
  };

  setParams(
    {
      ...getParamMetadata(RouteParamtypes.PARAM, 0),
      ...getParamMetadata(RouteParamtypes.QUERY, 1),
    },
    target,
    name,
  );
  setParamTypes([Object, RestfulParamsDto], prototype, name);
  setInterceptors([RestfulQueryInterceptor], prototype[name]);
  setAction(CrudActions.ReadOne, prototype[name]);
}

function createOneBase(target: object, name: string, dto?: any) {
  const prototype = (target as any).prototype;

  prototype[name] = function(body, params?: ObjectLiteral) {
    // TODO: complete implementation!
    const filter = this.getParamsFilter(params);
    return body;
  };

  setParams(
    {
      ...getParamMetadata(RouteParamtypes.BODY, 0),
      ...getParamMetadata(RouteParamtypes.PARAM, 1),
    },
    target,
    name,
  );
  setParamTypes([dto || Object, Object], prototype, name);
  setAction(CrudActions.CreateOne, prototype[name]);
}

function createManyBase(target: object, name: string, dto?: any) {
  const prototype = (target as any).prototype;

  prototype[name] = function(body, params?: ObjectLiteral) {
    // TODO: complete implementation!
    const filter = this.getParamsFilter(params);
    return body;
  };

  const isArray = mockValidatorDecorator('isArray');
  const ValidateNested = mockValidatorDecorator('ValidateNested');
  const Type = mockTransformerDecorator('Type');

  class BulkDto {
    @isArray()
    @ValidateNested({ each: true })
    @Type((t) => dto)
    bulk: any[];
  }

  setParams(
    {
      ...getParamMetadata(RouteParamtypes.BODY, 0),
      ...getParamMetadata(RouteParamtypes.PARAM, 1),
    },
    target,
    name,
  );
  setParamTypes([dto ? BulkDto : {}, Object], prototype, name);
  setAction(CrudActions.CreateMany, prototype[name]);
}

function updateOneBase(target: object, name: string, dto?: any) {
  const prototype = (target as any).prototype;

  prototype[name] = function(params: ObjectLiteral, body) {
    // TODO: complete implementation!
    const filter = this.getParamsFilter(params);
    return body;
  };

  setParams(
    {
      ...getParamMetadata(RouteParamtypes.PARAM, 0),
      ...getParamMetadata(RouteParamtypes.BODY, 1),
    },
    target,
    name,
  );
  setParamTypes([Object, dto || Object], prototype, name);
  setAction(CrudActions.UpdateOne, prototype[name]);
}

function deleteOneBase(target: object, name: string) {
  const prototype = (target as any).prototype;

  prototype[name] = function(params: ObjectLiteral) {
    // TODO: complete implementation!
    const filter = this.getParamsFilter(params);
    return 'deleted';
  };

  setParams(getParamMetadata(RouteParamtypes.PARAM, 0), target, name);
  setParamTypes([Object], prototype, name);
  setAction(CrudActions.DeleteOne, prototype[name]);
}

// Other methods

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

function getOptions(prototype: any) {
  prototype['getOptions'] = function() {
    return this.options ? this.options : {};
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

function getParamMetadata(paramtype: RouteParamtypes, index: number): any {
  return {
    [`${paramtype}:${index}`]: {
      index,
      pipes: [],
      data: undefined,
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

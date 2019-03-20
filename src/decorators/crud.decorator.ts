import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { isNil, isObject } from '@nestjs/common/utils/shared.utils';

import { RestfulParamsDto } from '../dto';
import { CrudActions, CrudValidate } from '../enums';
import { RestfulQueryInterceptor, RestfulParamsInterceptorFactory } from '../interceptors';
import { CrudOptions, FilterParamParsed, EntitiesBulk, RestfulOptions } from '../interfaces';
import { BaseRouteName } from '../types';
import {
  OVERRIDE_METHOD_METADATA,
  PARSED_PARAMS_REQUEST_KEY,
  PARSED_QUERY_REQUEST_KEY,
  PARSED_OPTIONS_METADATA,
} from '../constants';
import { mockValidatorDecorator, mockTransformerDecorator, hasValidator } from '../utils';
// import { CrudConfigService } from '../module/crud-config.service';
import {
  getOverrideMetadata,
  getInterceptors,
  getAction,
  getControllerPath,
  setAction,
  setInterceptors,
  setParamTypes,
  setParams,
  setRoute,
  setSwaggerQueryGetMany,
  setSwaggerQueryGetOne,
  setSwaggerParams,
  setValidationPipe,
  createParamMetadata,
  createCustomRequestParamMetadata,
  enableRoute,
} from './helpers';

interface BaseRoutes {
  [key: string]: {
    name: BaseRouteName;
    path: string;
    method: RequestMethod;
    enable: boolean;
    override: boolean;
  };
}

// Base routes
const baseRoutesInit = {
  /**
   * Get meny entities base route
   */
  getManyBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function getManyBase(query: RestfulParamsDto, options: RestfulOptions) {
      return this.service.getMany(query, options);
    };

    setParams(
      {
        ...createCustomRequestParamMetadata(PARSED_QUERY_REQUEST_KEY, 0),
        ...createCustomRequestParamMetadata(PARSED_OPTIONS_METADATA, 1),
      },
      target,
      name,
    );
    setParamTypes([RestfulParamsDto, Object], prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptorFactory(crudOptions),
        RestfulQueryInterceptor,
        ...getRoutesInterceptors(crudOptions.routes.getManyBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.ReadAll, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerQueryGetMany(prototype[name], dto.name);
  },

  /**
   * Get one entity base route
   */
  getOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function getOneBase(query: RestfulParamsDto, options: RestfulOptions) {
      return this.service.getOne(query, options);
    };

    setParams(
      {
        ...createCustomRequestParamMetadata(PARSED_QUERY_REQUEST_KEY, 0),
        ...createCustomRequestParamMetadata(PARSED_OPTIONS_METADATA, 1),
      },
      target,
      name,
    );
    setParamTypes([RestfulParamsDto, Object], prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptorFactory(crudOptions),
        RestfulQueryInterceptor,
        ...getRoutesInterceptors(crudOptions.routes.getOneBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.ReadOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerQueryGetOne(prototype[name], dto.name);
  },

  /**
   * Create one entity base route
   */
  createOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function createOneBase(params: FilterParamParsed[], body: any) {
      return this.service.createOne(body, params);
    };

    setParams(
      {
        ...createCustomRequestParamMetadata(PARSED_PARAMS_REQUEST_KEY, 0),
        ...createParamMetadata(RouteParamtypes.BODY, 1, [
          setValidationPipe(crudOptions, CrudValidate.CREATE),
        ]),
      },
      target,
      name,
    );
    setParamTypes([Array, dto], prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptorFactory(crudOptions),
        ...getRoutesInterceptors(crudOptions.routes.createOneBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.CreateOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
  },

  /**
   * Create many entities base route
   */
  createManyBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function createManyBase(params: FilterParamParsed[], body: any) {
      return this.service.createMany(body, params);
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
        ...createCustomRequestParamMetadata(PARSED_PARAMS_REQUEST_KEY, 0),
        ...createParamMetadata(RouteParamtypes.BODY, 1, [
          setValidationPipe(crudOptions, CrudValidate.CREATE),
        ]),
      },
      target,
      name,
    );
    setParamTypes([Array, hasValidator ? BulkDto : {}], prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptorFactory(crudOptions),
        ...getRoutesInterceptors(crudOptions.routes.createManyBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.CreateMany, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
  },

  /**
   * Update one entity base route
   */
  updateOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function updateOneBase(params: FilterParamParsed[], body) {
      return this.service.updateOne(body, params, crudOptions.routes);
    };

    setParams(
      {
        ...createCustomRequestParamMetadata(PARSED_PARAMS_REQUEST_KEY, 0),
        ...createParamMetadata(RouteParamtypes.BODY, 1, [
          setValidationPipe(crudOptions, CrudValidate.UPDATE),
        ]),
      },
      target,
      name,
    );
    setParamTypes([Array, dto], prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptorFactory(crudOptions),
        ...getRoutesInterceptors(crudOptions.routes.updateOneBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.UpdateOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
  },

  /**
   * Delete one entity route base
   */
  deleteOneBase(target: object, name: string, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function deleteOneBase(params: FilterParamParsed[]) {
      return this.service.deleteOne(params, crudOptions.routes);
    };

    setParams(
      {
        ...createCustomRequestParamMetadata(PARSED_PARAMS_REQUEST_KEY, 0),
      },
      target,
      name,
    );
    setParamTypes([Array], prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptorFactory(crudOptions),
        ...getRoutesInterceptors(crudOptions.routes.deleteOneBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.DeleteOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
  },
};

const getBaseRoutesSchema = (): BaseRoutes => ({
  getManyBase: {
    name: 'getManyBase',
    path: '/',
    method: RequestMethod.GET,
    enable: false,
    override: false,
  },
  getOneBase: {
    name: 'getOneBase',
    path: '',
    method: RequestMethod.GET,
    enable: false,
    override: false,
  },
  createOneBase: {
    name: 'createOneBase',
    path: '/',
    method: RequestMethod.POST,
    enable: false,
    override: false,
  },
  createManyBase: {
    name: 'createManyBase',
    path: '/bulk',
    method: RequestMethod.POST,
    enable: false,
    override: false,
  },
  updateOneBase: {
    name: 'updateOneBase',
    path: '',
    method: RequestMethod.PATCH,
    enable: false,
    override: false,
  },
  deleteOneBase: {
    name: 'deleteOneBase',
    path: '',
    method: RequestMethod.DELETE,
    enable: false,
    override: false,
  },
});

/**
 * @Crud() decorator
 * @param dto
 * @param crudOptions
 */
export const Crud = (dto: any, crudOptions: CrudOptions = {}) => (target: object) => {
  const prototype = (target as any).prototype;
  const baseRoutes = getBaseRoutesSchema();
  const path = getControllerPath(target);

  // set params options
  paramsOptionsInit(crudOptions);
  // get routes slug
  const slug = getRoutesSlugName(crudOptions, path);

  // set routes
  Object.keys(baseRoutes).forEach((name) => {
    const route = baseRoutes[name];

    if (enableRoute(route.name, crudOptions)) {
      // set slugs
      if (!route.path.length) {
        route.path = `/:${slug}`;
      }

      // create routes
      route.name !== 'deleteOneBase'
        ? baseRoutesInit[route.name](target, route.name, dto, crudOptions)
        : baseRoutesInit[route.name](target, route.name, crudOptions);
      route.enable = true;
    }
  });

  // method override
  Object.getOwnPropertyNames(prototype).forEach((name) => {
    const overrided = getOverrideMetadata(prototype[name]);
    const route = baseRoutes[overrided];

    if (overrided && route && route.enable) {
      // get base function metadata
      const interceptors = getInterceptors(prototype[name]) || [];
      const baseInterceptors = getInterceptors(prototype[overrided]) || [];
      const baseAction = getAction(prototype[overrided]);

      // set metadata
      setInterceptors([...baseInterceptors, ...interceptors], prototype[name]);
      setAction(baseAction, prototype[name]);

      // set route
      setRoute(route.path, route.method, prototype[name]);
      route.override = true;
    }
  });

  // set routes for base functions
  Object.keys(baseRoutes).forEach((name) => {
    const route = baseRoutes[name];

    if (!route.override && route.enable) {
      setRoute(route.path, route.method, prototype[route.name]);
    }
  });
};

/**
 * @Override() decorator
 * @param name
 */
export const Override = (name?: BaseRouteName) => (target, key, descriptor: PropertyDescriptor) => {
  Reflect.defineMetadata(OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
  return descriptor;
};

// Helpers

function paramsOptionsInit(crudOptions: CrudOptions) {
  const check = (obj) => isNil(obj) || !isObject(obj) || !Object.keys(obj).length;

  if (check(crudOptions.params)) {
    crudOptions.params = { id: 'number' };
  }

  if (check(crudOptions.routes)) {
    crudOptions.routes = {};
  }

  if (check(crudOptions.routes.getManyBase)) {
    crudOptions.routes.getManyBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.getOneBase)) {
    crudOptions.routes.getOneBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.createOneBase)) {
    crudOptions.routes.createOneBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.createManyBase)) {
    crudOptions.routes.createManyBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.updateOneBase)) {
    crudOptions.routes.updateOneBase = { allowParamsOverride: false, interceptors: [] };
  }

  if (check(crudOptions.routes.deleteOneBase)) {
    crudOptions.routes.deleteOneBase = { returnDeleted: false, interceptors: [] };
  }
}

function getRoutesSlugName(crudOptions: CrudOptions, path: string): string {
  if (!isNil(crudOptions.params.id)) {
    return 'id';
  }

  return Object.keys(crudOptions.params).filter((slug) => !path.includes(`:${slug}`))[0] || 'id';
}

function getRoutesInterceptors(routeOptions: any): any[] {
  return Array.isArray(routeOptions.interceptors) ? routeOptions.interceptors : [];
}

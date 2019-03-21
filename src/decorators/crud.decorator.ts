import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';

import { RestfulParamsDto } from '../dto';
import { CrudActions, CrudValidate } from '../enums';
import { RestfulQueryInterceptor, RestfulParamsInterceptorFactory } from '../interceptors';
import { CrudOptions, FilterParamParsed, EntitiesBulk, RoutesOptions } from '../interfaces';
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
  getRouteInterceptors,
  getAction,
  getControllerPath,
  getSwagger,
  getRoutesSlugName,
  setAction,
  setInterceptors,
  setParamTypes,
  setParams,
  setRoute,
  setSwagger,
  setSwaggerQueryGetMany,
  setSwaggerQueryGetOne,
  setSwaggerParams,
  setValidationPipe,
  createParamMetadata,
  createCustomRequestParamMetadata,
  enableRoute,
  paramsOptionsInit,
  cleanRoutesOptionsInterceptors,
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

    prototype[name] = function getManyBase(
      parsedQuery: RestfulParamsDto,
      parsedOptions: CrudOptions,
    ) {
      return this.service.getMany(parsedQuery, parsedOptions.options);
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
        ...getRouteInterceptors(crudOptions.routes.getManyBase),
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

    prototype[name] = function getOneBase(
      parsedQuery: RestfulParamsDto,
      parsedOptions: CrudOptions,
    ) {
      return this.service.getOne(parsedQuery, parsedOptions.options);
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
        ...getRouteInterceptors(crudOptions.routes.getOneBase),
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

    prototype[name] = function createOneBase(parsedParams: FilterParamParsed[], body: any) {
      return this.service.createOne(body, parsedParams);
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
        ...getRouteInterceptors(crudOptions.routes.createOneBase),
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

    prototype[name] = function createManyBase(parsedParams: FilterParamParsed[], body: any) {
      return this.service.createMany(body, parsedParams);
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
        ...getRouteInterceptors(crudOptions.routes.createManyBase),
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

    prototype[name] = function updateOneBase(parsedParams: FilterParamParsed[], body) {
      return this.service.updateOne(body, parsedParams, crudOptions.routes);
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
        ...getRouteInterceptors(crudOptions.routes.updateOneBase),
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

    prototype[name] = function deleteOneBase(parsedParams: FilterParamParsed[]) {
      return this.service.deleteOne(parsedParams, crudOptions.routes);
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
        ...getRouteInterceptors(crudOptions.routes.deleteOneBase),
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
      const baseSwagger = getSwagger(prototype[overrided]);

      // set metadata
      setInterceptors([...baseInterceptors, ...interceptors], prototype[name]);
      setAction(baseAction, prototype[name]);
      setSwagger(baseSwagger, prototype[name]);

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

  // clean interceptors in RoutesOptions for perf reasons
  cleanRoutesOptionsInterceptors(crudOptions);
};

/**
 * @Override() decorator
 * @param name
 */
export const Override = (name?: BaseRouteName) => (target, key, descriptor: PropertyDescriptor) => {
  Reflect.defineMetadata(OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
  return descriptor;
};

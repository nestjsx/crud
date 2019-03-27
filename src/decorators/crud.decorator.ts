import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';

import { RestfulParamsDto } from '../dto';
import { CrudActions, CrudValidate } from '../enums';
import { RestfulParamsInterceptor, RestfulQueryInterceptor } from '../interceptors';
import { CrudOptions, EntitiesBulk, FilterParamParsed } from '../interfaces';
import { BaseRouteName } from '../types';
import { OVERRIDE_METHOD_METADATA, PARSED_OPTIONS_METADATA, PARSED_PARAMS_REQUEST_KEY, PARSED_QUERY_REQUEST_KEY } from '../constants';
import { hasValidator, mockTransformerDecorator, mockValidatorDecorator } from '../utils';
import {
  cleanRoutesOptionsInterceptors,
  createCustomRequestParamMetadata,
  createParamMetadata,
  enableRoute,
  getAction,
  getControllerPath,
  getInterceptors,
  getOverrideMetadata,
  getRouteDecorators,
  getRouteInterceptors,
  getRoutesSlugName,
  getSwaggeOkResponse,
  getSwaggerOperation,
  getSwaggerParams,
  overrideParsedBody,
  setAction,
  setDecorators,
  setDefaultCrudOptions,
  setInterceptors,
  setParamTypes,
  setRoute,
  setRouteArgs,
  setSwaggerOkResponse,
  setSwaggerOkResponseMeta,
  setSwaggerOperation,
  setSwaggerOperationMeta,
  setSwaggerParams,
  setSwaggerParamsMeta,
  setSwaggerQueryGetMany,
  setSwaggerQueryGetOne,
  setValidationPipe,
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
   * Get many entities base route
   */
  getManyBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    // to let setDecorators works, the method must be define as a property like this
    prototype[name] = function getManyBase(
      parsedQuery: RestfulParamsDto,
      parsedOptions: CrudOptions,
    ) {
      return this.service.getMany(parsedQuery, parsedOptions.options);
    };

    setRouteArgs(
      {
        ...createCustomRequestParamMetadata(PARSED_QUERY_REQUEST_KEY, 0),
        ...createCustomRequestParamMetadata(PARSED_OPTIONS_METADATA, 1),
      },
      target,
      name,
    );
    setParamTypes([RestfulParamsDto, Object], prototype, name);
    setDecorators(getRouteDecorators(crudOptions.routes.getManyBase), prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptor,
        RestfulQueryInterceptor,
        ...getRouteInterceptors(crudOptions.routes.getManyBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.ReadAll, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerQueryGetMany(prototype[name], dto.name);
    setSwaggerOperation(prototype[name], `Retrieve many ${dto.name}`);
    setSwaggerOkResponse(prototype[name], dto, true);
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

    setRouteArgs(
      {
        ...createCustomRequestParamMetadata(PARSED_QUERY_REQUEST_KEY, 0),
        ...createCustomRequestParamMetadata(PARSED_OPTIONS_METADATA, 1),
      },
      target,
      name,
    );
    setParamTypes([RestfulParamsDto, Object], prototype, name);
    setDecorators(getRouteDecorators(crudOptions.routes.getOneBase), prototype, name);
    setInterceptors(
      [
        RestfulParamsInterceptor,
        RestfulQueryInterceptor,
        ...getRouteInterceptors(crudOptions.routes.getOneBase),
      ],
      prototype[name],
    );
    setAction(CrudActions.ReadOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerQueryGetOne(prototype[name]);
    setSwaggerOperation(prototype[name], `Retrieve one ${dto.name}`);
    setSwaggerOkResponse(prototype[name], dto);
  },

  /**
   * Create one entity base route
   */
  createOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function createOneBase(parsedParams: FilterParamParsed[], body: any) {
      return this.service.createOne(body, parsedParams);
    };

    setRouteArgs(
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
    setDecorators(getRouteDecorators(crudOptions.routes.createOneBase), prototype, name);
    setInterceptors(
      [RestfulParamsInterceptor, ...getRouteInterceptors(crudOptions.routes.createOneBase)],
      prototype[name],
    );
    setAction(CrudActions.CreateOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerOperation(prototype[name], `Create one ${dto.name}`);
    setSwaggerOkResponse(prototype[name], dto);
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

    /* istanbul ignore next line */
    const BulkDtoType = hasValidator ? BulkDto : {};

    setRouteArgs(
      {
        ...createCustomRequestParamMetadata(PARSED_PARAMS_REQUEST_KEY, 0),
        ...createParamMetadata(RouteParamtypes.BODY, 1, [
          setValidationPipe(crudOptions, CrudValidate.CREATE),
        ]),
      },
      target,
      name,
    );
    setParamTypes([Array, BulkDtoType], prototype, name);
    setDecorators(getRouteDecorators(crudOptions.routes.createManyBase), prototype, name);
    setInterceptors(
      [RestfulParamsInterceptor, ...getRouteInterceptors(crudOptions.routes.createManyBase)],
      prototype[name],
    );
    setAction(CrudActions.CreateMany, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerOperation(prototype[name], `Create many ${dto.name}`);
    setSwaggerOkResponse(prototype[name], dto, false);
  },

  /**
   * Update one entity base route
   */
  updateOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function updateOneBase(parsedParams: FilterParamParsed[], body) {
      return this.service.updateOne(body, parsedParams, crudOptions.routes);
    };

    setRouteArgs(
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
    setDecorators(getRouteDecorators(crudOptions.routes.updateOneBase), prototype, name);
    setInterceptors(
      [RestfulParamsInterceptor, ...getRouteInterceptors(crudOptions.routes.updateOneBase)],
      prototype[name],
    );
    setAction(CrudActions.UpdateOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerOperation(prototype[name], `Update one ${dto.name}`);
    setSwaggerOkResponse(prototype[name], dto);
  },

  /**
   * Delete one entity route base
   */
  deleteOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function deleteOneBase(parsedParams: FilterParamParsed[]) {
      return this.service.deleteOne(parsedParams, crudOptions.routes);
    };

    setRouteArgs(
      {
        ...createCustomRequestParamMetadata(PARSED_PARAMS_REQUEST_KEY, 0),
      },
      target,
      name,
    );
    setParamTypes([Array], prototype, name);
    setDecorators(getRouteDecorators(crudOptions.routes.deleteOneBase), prototype, name);
    setInterceptors(
      [RestfulParamsInterceptor, ...getRouteInterceptors(crudOptions.routes.deleteOneBase)],
      prototype[name],
    );
    setAction(CrudActions.DeleteOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerOperation(prototype[name], `Delete one ${dto.name}`);
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

  // set default crud options
  setDefaultCrudOptions(crudOptions, target);
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
      baseRoutesInit[route.name](target, route.name, dto, crudOptions);
      route.enable = true;
    }
  });

  // method override
  Object.getOwnPropertyNames(prototype).forEach((name) => {
    const override = getOverrideMetadata(prototype[name]);
    const route = baseRoutes[override];

    if (override && route && route.enable) {
      // get base function metadata
      const interceptors = getInterceptors(prototype[name]) || [];
      const baseInterceptors = getInterceptors(prototype[override]);
      const baseAction = getAction(prototype[override]);
      const baseSwaggerParams = getSwaggerParams(prototype[override]);
      const baseSwaggerOkResponse = getSwaggeOkResponse(prototype[override]);
      const baseSwaggerOperation = getSwaggerOperation(prototype[override]);

      // set metadata
      setInterceptors([...baseInterceptors, ...interceptors], prototype[name]);
      setAction(baseAction, prototype[name]);
      setSwaggerParamsMeta(baseSwaggerParams, prototype[name]);
      setSwaggerOkResponseMeta(baseSwaggerOkResponse, prototype[name]);
      setSwaggerOperationMeta(baseSwaggerOperation, prototype[name]);

      // override @ParsedBody() decorator is needed
      overrideParsedBody(target, override, name);

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

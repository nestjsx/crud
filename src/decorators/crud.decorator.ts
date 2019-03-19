import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';

import { RestfulParamsDto } from '../dto';
import { CrudActions, CrudValidate } from '../enums';
import { RestfulQueryInterceptor } from '../interceptors';
import { CrudOptions, FilterParamParsed, ObjectLiteral, EntitiesBulk } from '../interfaces';
import { OVERRIDE_METHOD_METADATA } from '../constants';
import { mockValidatorDecorator, mockTransformerDecorator, hasValidator } from '../utils';
import {
  getOverrideMetadata,
  getInterceptors,
  getAction,
  setAction,
  setInterceptors,
  setParamTypes,
  setParams,
  setRoute,
  setSwaggerQueryGetMany,
  setSwaggerQueryGetOne,
  setSwaggerParams,
  setValidationPipe,
  setParseIntPipe,
  createParamMetadata,
} from './helpers';

type BaseRouteName =
  | 'getManyBase'
  | 'getOneBase'
  | 'createOneBase'
  | 'createManyBase'
  | 'updateOneBase'
  | 'deleteOneBase';

interface BaseRoutes {
  [key: string]: {
    name: BaseRouteName;
    path: string;
    method: RequestMethod;
    override?: boolean;
  };
}

/**
 * @Crud() decorator
 * @param dto
 * @param crudOptions
 */
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
  getParamsFilterInit(prototype, crudOptions);
  getMergedOptionsInit(prototype, crudOptions);
  // set routes
  getManyBaseInit(target, baseRoutes.getManyBase.name, dto, crudOptions);
  getOneBaseInit(target, baseRoutes.getOneBase.name, dto, crudOptions);
  createOneBaseInit(target, baseRoutes.createOneBase.name, dto, crudOptions);
  createManyBaseInit(target, baseRoutes.createManyBase.name, dto, crudOptions);
  updateOneBaseInit(target, baseRoutes.updateOneBase.name, dto, crudOptions);
  deleteOneBaseInit(target, baseRoutes.deleteOneBase.name, crudOptions);

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

/**
 * @Override() decorator
 * @param name
 */
export const Override = (name?: BaseRouteName) => (target, key, descriptor: PropertyDescriptor) => {
  Reflect.defineMetadata(OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
  return descriptor;
};

// Base routes

/**
 * Get meny entities base route
 */
function getManyBaseInit(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function getManyBase(params: ObjectLiteral, query: RestfulParamsDto) {
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
  setSwaggerParams(prototype[name], crudOptions);
  setSwaggerQueryGetMany(prototype[name], dto.name);
}

/**
 * Get one entity base route
 */

function getOneBaseInit(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;
  prototype[name] = function getOneBase(
    id: string,
    params: ObjectLiteral,
    query: RestfulParamsDto,
  ) {
    const mergedOptions = this.getMergedOptions(params);

    return this.service.getOne(id, query, mergedOptions);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0, [], 'id'),
      ...createParamMetadata(RouteParamtypes.PARAM, 1),
      ...createParamMetadata(RouteParamtypes.QUERY, 2),
    },
    target,
    name,
  );
  setParamTypes([Number, Object, RestfulParamsDto], prototype, name);
  setInterceptors([RestfulQueryInterceptor], prototype[name]);
  setAction(CrudActions.ReadOne, prototype[name]);
  setSwaggerParams(prototype[name], crudOptions);
  setSwaggerQueryGetOne(prototype[name], dto.name);
}

/**
 * Create one entity base route
 */

function createOneBaseInit(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function createOneBase(params: ObjectLiteral, body: any) {
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
  setSwaggerParams(prototype[name], crudOptions);
}

/**
 * Create many entities base route
 */
function createManyBaseInit(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function createManyBase(params: ObjectLiteral, body: any) {
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
  setSwaggerParams(prototype[name], crudOptions);
}

/**
 * Update one entity base route
 */
function updateOneBaseInit(target: object, name: string, dto: any, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function updateOneBase(id: string, params: ObjectLiteral, body) {
    console.log('obj', params);
    const paramsFilter = this.getParamsFilter(params);

    return this.service.updateOne(id, body, paramsFilter);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0, [], 'id'),
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
  setSwaggerParams(prototype[name], crudOptions);
}

/**
 * Delete one entity route base
 */
function deleteOneBaseInit(target: object, name: string, crudOptions: CrudOptions) {
  const prototype = (target as any).prototype;

  prototype[name] = function deleteOneBase(id: number, params: ObjectLiteral) {
    const paramsFilter = this.getParamsFilter(params);
    return this.service.deleteOne(id, paramsFilter);
  };

  setParams(
    {
      ...createParamMetadata(RouteParamtypes.PARAM, 0, [], 'id'),
      ...createParamMetadata(RouteParamtypes.PARAM, 1),
    },
    target,
    name,
  );
  setParamTypes([Number, Object], prototype, name);
  setAction(CrudActions.DeleteOne, prototype[name]);
  setSwaggerParams(prototype[name], crudOptions);
}

// Helpers

function getParamsFilterInit(prototype: any, crudOptions: CrudOptions) {
  prototype['getParamsFilter'] = function getParamsFilter(
    params: ObjectLiteral,
  ): FilterParamParsed[] {
    if (!crudOptions.params || !params) {
      return [];
    }

    const isArray = Array.isArray(crudOptions.params);

    return (isArray ? crudOptions.params : Object.keys(crudOptions.params))
      .filter((field) => !!params[field])
      .map(
        (field) =>
          ({
            field: isArray ? field : crudOptions.params[field],
            operator: 'eq',
            value: params[field],
          } as FilterParamParsed),
      );
  };
}

function getMergedOptionsInit(prototype: any, crudOptions: CrudOptions) {
  prototype['getMergedOptions'] = function getMergedOptions(params: ObjectLiteral) {
    const paramsFilter = this.getParamsFilter(params);
    const options = Object.assign({}, crudOptions.options || {});
    const optionsFilter = options.filter || [];
    const filter = [...optionsFilter, ...paramsFilter];

    if (filter.length) {
      options.filter = filter;
    }

    return options;
  };
}

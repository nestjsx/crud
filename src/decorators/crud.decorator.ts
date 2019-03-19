import { RequestMethod } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { isNil } from '@nestjs/common/utils/shared.utils';

import { RestfulParamsDto } from '../dto';
import { CrudActions, CrudValidate } from '../enums';
import { RestfulQueryInterceptor } from '../interceptors';
import { CrudOptions, FilterParamParsed, ObjectLiteral, EntitiesBulk } from '../interfaces';
import { BaseRouteName } from '../types';
import { OVERRIDE_METHOD_METADATA } from '../constants';
import { mockValidatorDecorator, mockTransformerDecorator, hasValidator } from '../utils';
import { CrudConfigService } from '../module/crud-config.service';
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

    prototype[name] = function getManyBase(params: ObjectLiteral, query: RestfulParamsDto) {
      const options = this.getOptions(params);
      return this.service.getMany(query, options);
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
  },

  /**
   * Get one entity base route
   */
  getOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function getOneBase(params: ObjectLiteral, query: RestfulParamsDto) {
      const options = this.getOptions(params);
      return this.service.getOne(query, options);
    };

    setParams(
      {
        // ...createParamMetadata(RouteParamtypes.PARAM, 0, [setParseIntPipe()], 'id'),
        ...createParamMetadata(RouteParamtypes.PARAM, 0),
        ...createParamMetadata(RouteParamtypes.QUERY, 1),
      },
      target,
      name,
    );
    setParamTypes([Number, Object, RestfulParamsDto], prototype, name);
    setInterceptors([RestfulQueryInterceptor], prototype[name]);
    setAction(CrudActions.ReadOne, prototype[name]);
    setSwaggerParams(prototype[name], crudOptions);
    setSwaggerQueryGetOne(prototype[name], dto.name);
  },

  /**
   * Create one entity base route
   */
  createOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
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
  },

  /**
   * Create many entities base route
   */
  createManyBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
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
  },

  /**
   * Update one entity base route
   */
  updateOneBase(target: object, name: string, dto: any, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function updateOneBase(id: string, params: ObjectLiteral, body) {
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
    setSwaggerParams(prototype[name], crudOptions);
  },

  /**
   * Delete one entity route base
   */
  deleteOneBase(target: object, name: string, crudOptions: CrudOptions) {
    const prototype = (target as any).prototype;

    prototype[name] = function deleteOneBase(id: number, params: ObjectLiteral) {
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
    path: '/:id',
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
    path: '/:id',
    method: RequestMethod.PATCH,
    enable: false,
    override: false,
  },
  deleteOneBase: {
    name: 'deleteOneBase',
    path: '/:id',
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

  // set slug
  if (!crudOptions.slug) {
    crudOptions.slug = { field: 'id', type: 'number' };
  }

  // set helpers
  getParamsFilterInit(prototype, crudOptions);
  getOptionsInit(prototype, crudOptions);

  // set routes
  Object.keys(baseRoutes).forEach((name) => {
    const route = baseRoutes[name];

    if (enableRoute(route.name, crudOptions)) {
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

function getParamsFilterInit(prototype: any, crudOptions: CrudOptions) {
  prototype['getParamsFilter'] = function getParamsFilter(
    params: ObjectLiteral,
  ): FilterParamParsed[] {
    if (!params || !Object.keys(params).length) {
      return [];
    }

    // set params filter
    const isArray = Array.isArray(crudOptions.params);
    const paramsFilter = !isNil(crudOptions.params)
      ? (isArray ? crudOptions.params : Object.keys(crudOptions.params))
          .filter((field) => !!params[field])
          .map(
            (field) =>
              ({
                field: isArray ? field : crudOptions.params[field],
                operator: 'eq',
                value: params[field],
              } as FilterParamParsed),
          )
      : [];

    // return with added slug filter if exists
    return !isNil(params[crudOptions.slug.field])
      ? [
          {
            field: crudOptions.slug.field,
            operator: 'eq',
            value: params[crudOptions.slug.field],
          },
          ...paramsFilter,
        ]
      : paramsFilter;
  };
}

function getOptionsInit(prototype: any, crudOptions: CrudOptions) {
  prototype['getOptions'] = function getOptions(params: ObjectLiteral) {
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

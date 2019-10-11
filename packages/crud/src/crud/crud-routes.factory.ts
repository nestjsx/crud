import { RequestMethod, HttpStatus } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  hasLength,
  isArrayFull,
  isObjectFull,
  objKeys,
  isIn,
  isEqual,
  getOwnPropNames,
  isNil,
} from '@nestjsx/util';
import * as deepmerge from 'deepmerge';

import { R } from './reflection.helper';
import { Swagger } from './swagger.helper';
import { Validation } from './validation.helper';
import { CrudRequestInterceptor } from '../interceptors';
import { BaseRoute, CrudOptions, CrudRequest, MergedCrudOptions } from '../interfaces';
import { BaseRouteName } from '../types';
import { CrudActions, CrudValidationGroups } from '../enums';
import { CrudConfigService } from '../module';

export class CrudRoutesFactory {
  protected options: MergedCrudOptions;

  constructor(private target: any, options: CrudOptions) {
    this.options = options;
    this.create();
  }

  static create(target: any, options: CrudOptions): CrudRoutesFactory {
    return new CrudRoutesFactory(target, options);
  }

  private get targetProto(): any {
    return this.target.prototype;
  }

  private get modelName(): string {
    return this.options.model.type.name;
  }

  private get modelType(): any {
    return this.options.model.type;
  }

  private get actionsMap(): { [key in BaseRouteName]: CrudActions } {
    return {
      getManyBase: CrudActions.ReadAll,
      getOneBase: CrudActions.ReadOne,
      createManyBase: CrudActions.CreateMany,
      createOneBase: CrudActions.CreateOne,
      updateOneBase: CrudActions.UpdateOne,
      deleteOneBase: CrudActions.DeleteOne,
      replaceOneBase: CrudActions.ReplaceOne,
    };
  }

  private create() {
    const routesSchema = this.getRoutesSchema();
    this.mergeOptions();
    this.createRoutes(routesSchema);
    this.overrideRoutes(routesSchema);
    this.enableRoutes(routesSchema);
  }

  private mergeOptions() {
    // merge auth config
    const authOptions = R.getCrudAuthOptions(this.target);
    this.options.auth = isObjectFull(authOptions) ? authOptions : {};
    this.options.auth.property =
      this.options.auth.property || CrudConfigService.config.auth.property;

    // merge query config
    const query = isObjectFull(this.options.query) ? this.options.query : {};
    this.options.query = { ...CrudConfigService.config.query, ...query };

    // merge routes config
    const routes = isObjectFull(this.options.routes) ? this.options.routes : {};
    this.options.routes = deepmerge(CrudConfigService.config.routes, routes, {
      arrayMerge: (a, b, c) => b,
    });

    // set params
    this.options.params = isObjectFull(this.options.params)
      ? this.options.params
      : isObjectFull(CrudConfigService.config.params)
      ? CrudConfigService.config.params
      : {};
    const hasPrimary = this.getPrimaryParam();
    if (!hasPrimary) {
      this.options.params['id'] = {
        field: 'id',
        type: 'number',
        primary: true,
      };
    }

    R.setCrudOptions(this.options, this.target);
  }

  private getRoutesSchema(): BaseRoute[] {
    return [
      {
        name: 'getManyBase',
        path: '/',
        method: RequestMethod.GET,
        enable: false,
        override: false,
        withParams: false,
      },
      {
        name: 'getOneBase',
        path: '/',
        method: RequestMethod.GET,
        enable: false,
        override: false,
        withParams: true,
      },
      {
        name: 'createOneBase',
        path: '/',
        method: RequestMethod.POST,
        enable: false,
        override: false,
        withParams: false,
      },
      {
        name: 'createManyBase',
        path: '/bulk',
        method: RequestMethod.POST,
        enable: false,
        override: false,
        withParams: false,
      },
      {
        name: 'updateOneBase',
        path: '/',
        method: RequestMethod.PATCH,
        enable: false,
        override: false,
        withParams: true,
      },
      {
        name: 'replaceOneBase',
        path: '/',
        method: RequestMethod.PUT,
        enable: false,
        override: false,
        withParams: true,
      },
      {
        name: 'deleteOneBase',
        path: '/',
        method: RequestMethod.DELETE,
        enable: false,
        override: false,
        withParams: true,
      },
    ];
  }

  private getManyBase(name: BaseRouteName) {
    this.targetProto[name] = function getManyBase(req: CrudRequest) {
      return this.service.getMany(req);
    };
  }

  private getOneBase(name: BaseRouteName) {
    this.targetProto[name] = function getOneBase(req: CrudRequest) {
      return this.service.getOne(req);
    };
  }

  private createOneBase(name: BaseRouteName) {
    this.targetProto[name] = function createOneBase(req: CrudRequest, dto: any) {
      return this.service.createOne(req, dto);
    };
  }

  private createManyBase(name: BaseRouteName) {
    this.targetProto[name] = function createManyBase(req: CrudRequest, dto: any) {
      return this.service.createMany(req, dto);
    };
  }

  private updateOneBase(name: BaseRouteName) {
    this.targetProto[name] = function updateOneBase(req: CrudRequest, dto: any) {
      return this.service.updateOne(req, dto);
    };
  }

  private replaceOneBase(name: BaseRouteName) {
    this.targetProto[name] = function replaceOneBase(req: CrudRequest, dto: any) {
      return this.service.replaceOne(req, dto);
    };
  }

  private deleteOneBase(name: BaseRouteName) {
    this.targetProto[name] = function deleteOneBase(req: CrudRequest) {
      return this.service.deleteOne(req);
    };
  }

  private canCreateRoute(name: string) {
    const only = this.options.routes.only;
    const exclude = this.options.routes.exclude;

    if (isArrayFull(only)) {
      return only.some((route) => route === name);
    }

    if (isArrayFull(exclude)) {
      return !exclude.some((route) => route === name);
    }

    return true;
  }

  private createRoutes(routesSchema: BaseRoute[]) {
    const primaryParam = this.getPrimaryParam();

    routesSchema.forEach((route) => {
      if (this.canCreateRoute(route.name)) {
        // create base method
        this[route.name](route.name);
        route.enable = true;
        // set metadata
        this.setBaseRouteMeta(route.name);
      }

      if (route.withParams && !this.options.params[primaryParam].disabled) {
        route.path = `/:${primaryParam}`;
      }
    });
  }

  private overrideRoutes(routesSchema: BaseRoute[]) {
    getOwnPropNames(this.targetProto).forEach((name) => {
      const override = R.getOverrideRoute(this.targetProto[name]);
      const route = routesSchema.find((r) => isEqual(r.name, override));

      if (override && route && route.enable) {
        // get metadata
        const interceptors = R.getInterceptors(this.targetProto[name]);
        const baseInterceptors = R.getInterceptors(this.targetProto[override]);
        const baseAction = R.getAction(this.targetProto[override]);
        const operation = Swagger.getOperation(this.targetProto[name]);
        const baseOperation = Swagger.getOperation(this.targetProto[override]);
        const swaggerParams = Swagger.getParams(this.targetProto[name]);
        const baseSwaggerParams = Swagger.getParams(this.targetProto[override]);
        const responseOk = Swagger.getResponseOk(this.targetProto[name]);
        const baseResponseOk = Swagger.getResponseOk(this.targetProto[override]);
        // set metadata
        R.setInterceptors([...baseInterceptors, ...interceptors], this.targetProto[name]);
        R.setAction(baseAction, this.targetProto[name]);
        Swagger.setOperation({ ...baseOperation, ...operation }, this.targetProto[name]);
        Swagger.setParams(
          [...baseSwaggerParams, ...swaggerParams],
          this.targetProto[name],
        );
        Swagger.setResponseOk(
          { ...baseResponseOk, ...responseOk },
          this.targetProto[name],
        );
        this.overrideParsedBodyDecorator(override, name);
        // enable route
        R.setRoute(route, this.targetProto[name]);
        route.override = true;
      }
    });
  }

  private enableRoutes(routesSchema: BaseRoute[]) {
    routesSchema.forEach((route) => {
      if (!route.override && route.enable) {
        R.setRoute(route, this.targetProto[route.name]);
      }
    });
  }

  private overrideParsedBodyDecorator(override: BaseRouteName, name: string) {
    const allowed = [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
    ] as BaseRouteName[];
    const withBody = isIn(override, allowed);
    const parsedBody = R.getParsedBody(this.targetProto[name]);

    if (withBody && parsedBody) {
      const baseKey = `${RouteParamtypes.BODY}:1`;
      const key = `${RouteParamtypes.BODY}:${parsedBody.index}`;
      const baseRouteArgs = R.getRouteArgs(this.target, override);
      const routeArgs = R.getRouteArgs(this.target, name);
      const baseBodyArg = baseRouteArgs[baseKey];
      R.setRouteArgs(
        {
          ...routeArgs,
          [key]: {
            ...baseBodyArg,
            index: parsedBody.index,
          },
        },
        this.target,
        name,
      );

      /* istanbul ignore else */
      if (isEqual(override, 'createManyBase')) {
        const paramTypes = R.getRouteArgsTypes(this.targetProto, name);
        const metatype = paramTypes[parsedBody.index];
        const types = [String, Boolean, Number, Array, Object];
        const toCopy =
          isIn(metatype, types) || /* istanbul ignore next */ isNil(metatype);

        /* istanbul ignore else */
        if (toCopy) {
          const baseParamTypes = R.getRouteArgsTypes(this.targetProto, override);
          const baseMetatype = baseParamTypes[1];
          paramTypes.splice(parsedBody.index, 1, baseMetatype);
          R.setRouteArgsTypes(paramTypes, this.targetProto, name);
        }
      }
    }
  }

  private getPrimaryParam(): string {
    return objKeys(this.options.params).find(
      (param) => this.options.params[param] && this.options.params[param].primary,
    );
  }

  private setBaseRouteMeta(name: BaseRouteName) {
    this.setRouteArgs(name);
    this.setRouteArgsTypes(name);
    this.setInterceptors(name);
    this.setAction(name);
    this.setSwaggerOperation(name);
    this.setSwaggerPathParams(name);
    this.setSwaggerQueryParams(name);
    this.setSwaggerResponseOk(name);
    // set decorators after Swagger so metadata can be overwritten
    this.setDecorators(name);
  }

  private setRouteArgs(name: BaseRouteName) {
    let rest = {};
    const toValidate: BaseRouteName[] = [
      'createManyBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
    ];

    if (isIn(name, toValidate)) {
      const group =
        isEqual(name, 'updateOneBase') || isEqual(name, 'replaceOneBase')
          ? CrudValidationGroups.UPDATE
          : CrudValidationGroups.CREATE;
      rest = R.setBodyArg(1, [Validation.getValidationPipe(this.options, group)]);
    }

    R.setRouteArgs({ ...R.setParsedRequestArg(0), ...rest }, this.target, name);
  }

  private setRouteArgsTypes(name: BaseRouteName) {
    if (isEqual(name, 'createManyBase')) {
      const bulkDto = Validation.createBulkDto(this.options);
      R.setRouteArgsTypes([Object, bulkDto], this.targetProto, name);
    } else if (
      isEqual(name, 'createOneBase') ||
      isEqual(name, 'updateOneBase') ||
      isEqual(name, 'replaceOneBase')
    ) {
      R.setRouteArgsTypes([Object, this.modelType], this.targetProto, name);
    } else {
      R.setRouteArgsTypes([Object], this.targetProto, name);
    }
  }

  private setInterceptors(name: BaseRouteName) {
    const interceptors = this.options.routes[name].interceptors;
    R.setInterceptors(
      [
        CrudRequestInterceptor,
        ...(isArrayFull(interceptors) ? /* istanbul ignore next */ interceptors : []),
      ],
      this.targetProto[name],
    );
  }

  private setDecorators(name: BaseRouteName) {
    const decorators = this.options.routes[name].decorators;
    R.setDecorators(
      isArrayFull(decorators) ? /* istanbul ignore next */ decorators : [],
      this.targetProto,
      name,
    );
  }

  private setAction(name: BaseRouteName) {
    R.setAction(this.actionsMap[name], this.targetProto[name]);
  }

  private setSwaggerOperation(name: BaseRouteName) {
    const summary = Swagger.operationsMap(this.modelName)[name];
    Swagger.setOperation({ summary }, this.targetProto[name]);
  }

  private setSwaggerPathParams(name: BaseRouteName) {
    const metadata = Swagger.getParams(this.targetProto[name]);
    const withoutPrimary: BaseRouteName[] = [
      'createManyBase',
      'createOneBase',
      'getManyBase',
    ];
    const params = isIn(name, withoutPrimary)
      ? objKeys(this.options.params).reduce(
          (a, c) =>
            this.options.params[c].primary ? a : { ...a, [c]: this.options.params[c] },
          {},
        )
      : this.options.params;
    const pathParamsMeta = Swagger.createPathParasmMeta(params);
    Swagger.setParams([...metadata, ...pathParamsMeta], this.targetProto[name]);
  }

  private setSwaggerQueryParams(name: BaseRouteName) {
    const metadata = Swagger.getParams(this.targetProto[name]);
    const queryParamsMeta = Swagger.createQueryParamsMeta(name);
    Swagger.setParams([...metadata, ...queryParamsMeta], this.targetProto[name]);
  }

  private setSwaggerResponseOk(name: BaseRouteName) {
    const status =
      isEqual(name, 'createManyBase') || isEqual(name, 'createOneBase')
        ? HttpStatus.CREATED
        : HttpStatus.OK;
    const isArray = isEqual(name, 'createManyBase') || isEqual(name, 'getManyBase');
    const metadata = Swagger.getResponseOk(this.targetProto[name]);
    const responseOkMeta = Swagger.createReponseOkMeta(status, isArray, this.modelType);
    Swagger.setResponseOk({ ...metadata, ...responseOkMeta }, this.targetProto[name]);
  }
}

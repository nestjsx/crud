import { RequestMethod } from '@nestjs/common';
import { hasLength, isArrayFull, isObjectFull, objKeys } from '@nestjsx/util';

import { R } from './reflection.helper';
import { Swagger } from './swagger.helper';
import { CrudRequestInterceptor } from '../interceptors';
import { BaseRoute, CrudOptions, CrudRequest, BaseRouteOptions } from '../interfaces';
import { BaseRouteName } from '../types';
import { CrudActions } from '../enums';

export class CrudRoutesFactory {
  constructor(private target: any, private options: CrudOptions) {
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

  private get actionsMap(): { [key in BaseRouteName]: CrudActions } {
    return {
      getManyBase: CrudActions.ReadAll,
      getOneBase: CrudActions.ReadOne,
      createManyBase: CrudActions.CreateMany,
      createOneBase: CrudActions.CreateOne,
      updateOneBase: CrudActions.UpdateOne,
      deleteOneBase: CrudActions.DeleteOne,
    };
  }

  private create() {
    const routesSchema = this.getRoutesSchema();
    this.setOptionsDefaults();
    this.createRoutes(routesSchema);
    this.overrideRoutes(routesSchema);
    this.enableRoutes(routesSchema);
  }

  private setOptionsDefaults() {
    if (!isObjectFull(this.options.model)) {
      this.options.model = {
        type: {},
        service: 'typeorm',
      };
    }
    if (!isObjectFull(this.options.params)) {
      this.options.params = {
        id: {
          field: 'id',
          type: 'number',
          primary: true,
        },
      };
    }
    if (!isObjectFull(this.options.routes)) {
      this.options.routes = {};
    }
    if (!isObjectFull(this.options.routes.getManyBase)) {
      this.options.routes.getManyBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(this.options.routes.getOneBase)) {
      this.options.routes.getOneBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(this.options.routes.createOneBase)) {
      this.options.routes.createOneBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(this.options.routes.createManyBase)) {
      this.options.routes.createManyBase = { interceptors: [], decorators: [] };
    }
    if (!isObjectFull(this.options.routes.updateOneBase)) {
      this.options.routes.updateOneBase = {
        allowParamsOverride: false,
        interceptors: [],
        decorators: [],
      };
    }
    if (!isObjectFull(this.options.routes.deleteOneBase)) {
      this.options.routes.deleteOneBase = {
        returnDeleted: false,
        interceptors: [],
        decorators: [],
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
      },
      {
        name: 'getOneBase',
        path: '',
        method: RequestMethod.GET,
        enable: false,
        override: false,
      },
      {
        name: 'createOneBase',
        path: '/',
        method: RequestMethod.POST,
        enable: false,
        override: false,
      },
      {
        name: 'createManyBase',
        path: '/bulk',
        method: RequestMethod.POST,
        enable: false,
        override: false,
      },
      {
        name: 'updateOneBase',
        path: '',
        method: RequestMethod.PATCH,
        enable: false,
        override: false,
      },
      {
        name: 'deleteOneBase',
        path: '',
        method: RequestMethod.DELETE,
        enable: false,
        override: false,
      },
    ];
  }

  private getManyBase(name: BaseRouteName) {
    this.targetProto[name] = function getManyBase(parsedRequest: CrudRequest) {
      return [];
    };
  }

  private getOneBase(name: BaseRouteName) {
    this.targetProto[name] = function getOneBase(parsedRequest: CrudRequest) {
      return [];
    };
  }

  private createOneBase(name: BaseRouteName) {
    this.targetProto[name] = function createOneBase(parsedRequest: CrudRequest) {
      return [];
    };
  }

  private createManyBase(name: BaseRouteName) {
    this.targetProto[name] = function createManyBase(parsedRequest: CrudRequest) {
      return [];
    };
  }

  private updateOneBase(name: BaseRouteName) {
    this.targetProto[name] = function updateOneBase(parsedRequest: CrudRequest) {
      return [];
    };
  }

  private deleteOneBase(name: BaseRouteName) {
    this.targetProto[name] = function deleteOneBase(parsedRequest: CrudRequest) {
      return [];
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
        const { name } = route;

        // create base method
        this[name](name);
        route.enable = true;
        // set metadata
        this.setArgs(name);
        this.setInterceptors(name);
        this.setAction(name);
        this.setSwaggerOperation(name);
        this.setSwaggerParams(name);
      }

      if (!hasLength(route.path)) {
        route.path = `/:${primaryParam}`;
      }
    });
  }

  private overrideRoutes(routesSchema: BaseRoute[]) {
    // getOwnPropNames(this.targetProto).forEach((name) => {});
  }

  private enableRoutes(routesSchema: BaseRoute[]) {
    routesSchema.forEach((route) => {
      if (!route.override && route.enable) {
        R.setRoute(route, this.targetProto[route.name]);
      }
    });
  }

  private getPrimaryParam(): string {
    return objKeys(this.options.params).find(
      (param) => this.options.params[param].primary,
    );
  }

  private setArgs(name: BaseRouteName, rest: any = {}) {
    R.setRouteArgs({ ...R.setParsedRequest(0), ...rest }, this.target, name);
  }

  private setInterceptors(name: BaseRouteName) {
    const interceptors = this.options.routes[name].interceptors;
    R.setInterceptors(
      [CrudRequestInterceptor, ...(isArrayFull(interceptors) ? interceptors : [])],
      this.targetProto[name],
    );
  }

  private setAction(name: BaseRouteName) {
    R.setAction(this.actionsMap[name], this.targetProto[name]);
  }

  private setSwaggerOperation(name: BaseRouteName) {
    Swagger.setOperation(name, this.modelName, this.targetProto[name]);
  }

  private setSwaggerParams(name: BaseRouteName) {
    const metadata = Swagger.getParams(this.targetProto[name]);
    const pathParamsMeta = Swagger.createPathParamMeta(this.options.params);
    Swagger.setParams([...metadata, pathParamsMeta], this.targetProto[name]);
  }
}

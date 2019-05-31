import { RequestMethod } from '@nestjs/common';
import {
  hasLength,
  isArrayFull,
  isObjectFull,
  getOwnPropNames,
  objKeys,
} from '@nestjsx/util';

import { R } from './reflection.helper';
import { N } from './nest.helper';
import { CrudRequestInterceptor } from '../interceptors';
import { BaseRoute, CrudOptions, CrudRequest } from '../interfaces';
import { BaseRouteName } from '../types';

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

  private create() {
    const routesSchema = this.getRoutesSchema();
    this.setOptionsDefaults();
    this.createRoutes(routesSchema);
    this.overrideRoutes(routesSchema);
    this.enableRoutes(routesSchema);
  }

  private setOptionsDefaults() {
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

  private getManyBase() {
    const name: BaseRouteName = 'getManyBase';

    this.targetProto[name] = function getManyBase(parsedRequest: CrudRequest) {
      return [];
    };

    R.setRouteArgs({ ...N.setParsedRequest(0) }, this.target, name);
    R.setInterceptors([CrudRequestInterceptor], this.targetProto[name]);
  }

  private getOneBase() {
    const name: BaseRouteName = 'getOneBase';

    this.targetProto[name] = function getOneBase(parsedRequest: CrudRequest) {
      return parsedRequest;
    };

    R.setRouteArgs({ ...N.setParsedRequest(0) }, this.target, name);
    R.setInterceptors([CrudRequestInterceptor], this.targetProto[name]);
  }

  private createOneBase() {
    const name: BaseRouteName = 'createOneBase';

    this.targetProto[name] = function createOneBase() {
      return [];
    };
  }

  private createManyBase() {
    const name: BaseRouteName = 'createManyBase';

    this.targetProto[name] = function createManyBase() {
      return [];
    };
  }

  private updateOneBase() {
    const name: BaseRouteName = 'updateOneBase';

    this.targetProto[name] = function updateOneBase() {
      return [];
    };
  }

  private deleteOneBase() {
    const name: BaseRouteName = 'deleteOneBase';

    this.targetProto[name] = function deleteOneBase() {
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
        this[route.name]();
        route.enable = true;
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
}

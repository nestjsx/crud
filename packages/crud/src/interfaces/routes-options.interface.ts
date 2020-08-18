import { BaseRouteName } from '../types';

export interface RoutesOptions {
  exclude?: BaseRouteName[];
  only?: BaseRouteName[];
  getManyBase?: GetMayRouteOptions;
  getOneBase?: GetOneRouteOptions;
  createOneBase?: CreateOneRouteOptions;
  createManyBase?: CreateManyRouteOptions;
  updateOneBase?: UpdateOneRouteOptions;
  replaceOneBase?: ReplaceOneRouteOptions;
  deleteOneBase?: DeleteOneRouteOptions;
}

export interface BaseRouteOptions {
  interceptors?: any[];
  decorators?: Array<PropertyDecorator | MethodDecorator>;
}

export interface GetMayRouteOptions extends BaseRouteOptions {}

export interface GetOneRouteOptions extends BaseRouteOptions {}

export interface CreateOneRouteOptions extends BaseRouteOptions {
  returnShallow?: boolean;
}

export interface CreateManyRouteOptions extends BaseRouteOptions {}

export interface ReplaceOneRouteOptions extends BaseRouteOptions {
  allowParamsOverride?: boolean;
  returnShallow?: boolean;
}

export interface UpdateOneRouteOptions extends BaseRouteOptions {
  allowParamsOverride?: boolean;
  returnShallow?: boolean;
}

export interface DeleteOneRouteOptions extends BaseRouteOptions {
  returnDeleted?: boolean;
  softDelete?: boolean;
}

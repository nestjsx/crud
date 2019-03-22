import { BaseRouteName } from '../types';
export interface RoutesOptions {
    exclude?: BaseRouteName[];
    only?: BaseRouteName[];
    getManyBase?: GetMayRouteOptions;
    getOneBase?: GetOneRouteOptions;
    createOneBase?: CreateOneRouteOptions;
    createManyBase?: CreateManyRouteOptions;
    updateOneBase?: UpdateOneRouteOptions;
    deleteOneBase?: DeleteOneRouteOptions;
}
export interface GetMayRouteOptions {
    interceptors?: any[];
}
export interface GetOneRouteOptions {
    interceptors?: any[];
}
export interface CreateOneRouteOptions {
    interceptors?: any[];
}
export interface CreateManyRouteOptions {
    interceptors?: any[];
}
export interface UpdateOneRouteOptions {
    interceptors?: any[];
    allowParamsOverride?: boolean;
}
export interface DeleteOneRouteOptions {
    interceptors?: any[];
    returnDeleted?: boolean;
}

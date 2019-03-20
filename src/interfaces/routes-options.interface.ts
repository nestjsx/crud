import { BaseRouteName } from '../types';

export interface RoutesOptions {
  exclude?: BaseRouteName[];
  only?: BaseRouteName[];
  getManyBase?: { interceptors?: any[] };
  getOneBase?: { interceptors?: any[] };
  createOneBase?: { interceptors?: any[] };
  createManyBase?: { interceptors?: any[] };
  updateOneBase?: { interceptors?: any[]; allowParamsOverride?: boolean };
  deleteOneBase?: { interceptors?: any[]; returnDeleted?: boolean };
}

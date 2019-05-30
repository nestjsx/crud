import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { ParamsOptions } from './params-options.interface';

export interface CrudOptions {
  model?: any;
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
}

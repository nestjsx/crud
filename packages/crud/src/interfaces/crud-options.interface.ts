import { RestfulOptions } from './restful-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { ParamsOptions } from './params-options.interface';

export interface CrudOptions {
  options?: RestfulOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
}

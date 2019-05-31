import { ModelOptions } from './model-options.interface';
import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { ParamsOptions } from './params-options.interface';
export interface CrudOptions {
    model?: ModelOptions;
    query?: QueryOptions;
    routes?: RoutesOptions;
    params?: ParamsOptions;
}

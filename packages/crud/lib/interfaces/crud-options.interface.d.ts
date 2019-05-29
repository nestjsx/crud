import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { ParamOptions } from './param-options.interface';
export interface CrudOptions {
    model?: any;
    query?: QueryOptions;
    routes?: RoutesOptions;
    param?: ParamOptions;
}

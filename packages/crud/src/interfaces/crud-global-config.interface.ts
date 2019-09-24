import { RequestQueryBuilderOptions } from "@nestjsx/crud-request";

import { ParamsOptions } from "./params-options.interface";
import { RoutesOptions } from "./routes-options.interface";

export interface CrudGlobalConfig {
  queryParser?: RequestQueryBuilderOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  query?: {
    limit?: number;
    maxLimit?: number;
    cache?: number | false;
  };
}

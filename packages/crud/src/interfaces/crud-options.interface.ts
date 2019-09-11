import { ValidationPipeOptions } from '@nestjs/common';

import { ModelOptions } from './model-options.interface';
import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { ParamsOptions } from './params-options.interface';
import { CustomOperators } from './custom-operators.interface';

export interface CrudRequestOptions {
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  customOperators?: CustomOperators;
}

export interface CrudOptions extends CrudRequestOptions {
  model: ModelOptions;
  validation?: ValidationPipeOptions | false;
}

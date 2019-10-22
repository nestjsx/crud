import { ValidationPipeOptions } from '@nestjs/common';

import { ModelOptions } from './model-options.interface';
import { ParamsOptions } from './params-options.interface';
import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { AuthOptions } from './auth-options.interface';
import { DtoOptions } from './dto-options.interface';

export interface CrudRequestOptions {
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
}

export interface CrudOptions {
  model: ModelOptions;
  dto?: DtoOptions;
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  validation?: ValidationPipeOptions | false;
}

export interface MergedCrudOptions extends CrudOptions {
  auth?: AuthOptions;
}

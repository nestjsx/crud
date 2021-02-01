import { ValidationPipeOptions } from '@nestjs/common';
import { AuthOptions } from './auth-options.interface';
import { DtoOptions } from './dto-options.interface';

import { ModelOptions } from './model-options.interface';
import { ParamsOptions } from './params-options.interface';
import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { SerializeOptions } from './serialize-options.interface';

export interface CrudRequestOptions {
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
}

export interface CrudOptions extends CrudRequestOptions {
  model: ModelOptions;
  dto?: DtoOptions;
  serialize?: SerializeOptions;
  validation?: ValidationPipeOptions | false;
}

export interface MergedCrudOptions extends CrudOptions {
  auth?: AuthOptions;
}

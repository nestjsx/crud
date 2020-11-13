import { ValidationPipeOptions } from '@nestjs/common';

import { ModelOptions } from './model-options.interface';
import { ParamsOptions } from './params-options.interface';
import { QueryOptions } from './query-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { AuthOptions } from './auth-options.interface';
import { DtoOptions } from './dto-options.interface';
import { SerializeOptions } from './serialize-options.interface';
import { CrudRoutesFactory } from '../crud';

export interface CrudRequestOptions {
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
}

export interface CrudOptions {
  model: ModelOptions;
  dto?: DtoOptions;
  serialize?: SerializeOptions;
  query?: QueryOptions;
  routes?: RoutesOptions;
  params?: ParamsOptions;
  validation?: ValidationPipeOptions | false;
  crudRoutesFactory?: typeof CrudRoutesFactory;
}

export interface MergedCrudOptions extends CrudOptions {
  auth?: AuthOptions;
}

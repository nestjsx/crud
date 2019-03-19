import { ValidationPipeOptions } from '@nestjs/common';

import { ObjectLiteral } from './object-literal.interface';
import { RestfulOptions } from './restful-options.interface';
import { RoutesOptions } from './routes-options.interface';
import { SlugOptions } from './slug-options.interface';

export interface CrudOptions {
  options?: RestfulOptions;
  routes?: RoutesOptions;
  params?: ObjectLiteral | string[];
  slug?: SlugOptions;
  validation?: ValidationPipeOptions;
}

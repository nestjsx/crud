import { Query } from '@nestjs/common';

import { RestfulQueryPipe } from '../pipes/restful-query.pipe';
import { RestfulQueryValidationPipe } from '../pipes/restful-query-validation.pipe';

export const RestfulQuery = (...args: any[]) =>
  Query(RestfulQueryPipe, RestfulQueryValidationPipe, ...args);

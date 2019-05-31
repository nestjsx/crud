import { ParsedRequestParams } from '@nestjsx/crud-request/lib/interfaces';

import { CrudOptions } from '../interfaces';

export interface CrudRequest extends ParsedRequestParams {
  options: CrudOptions;
}

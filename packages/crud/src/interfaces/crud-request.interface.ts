import { ParsedRequestParams } from '@vianneybr/nestjsx-crud-request';

import { CrudRequestOptions } from '../interfaces';

export interface CrudRequest {
  parsed: ParsedRequestParams;
  options: CrudRequestOptions;
}

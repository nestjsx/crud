import { ParsedRequestParams } from '../../crud-request';
import { CrudRequestOptions } from '.';

export interface CrudRequest {
  parsed: ParsedRequestParams;
  options: CrudRequestOptions;
}

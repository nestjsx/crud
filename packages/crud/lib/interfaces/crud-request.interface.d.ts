import { ParsedRequestParams } from '@nestjsx/crud-request/lib/interfaces';
import { CrudRequestOptions } from '../interfaces';
export interface CrudRequest {
    parsed: ParsedRequestParams;
    options: CrudRequestOptions;
}

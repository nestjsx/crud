import { QueryFields, QueryFilter, QueryJoin, QuerySort } from '../types';
export interface ParsedRequestParams {
    fields: QueryFields;
    paramsFilter: QueryFilter[];
    filter: QueryFilter[];
    or: QueryFilter[];
    join: QueryJoin[];
    sort: QuerySort[];
    limit: number;
    offset: number;
    page: number;
    cache: number;
}

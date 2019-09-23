import { QueryFields, QueryFilter, QueryJoin, QuerySort, SCondition } from '../types';

export interface ParsedRequestParams {
  fields: QueryFields;
  paramsFilter: QueryFilter[];
  search: SCondition;
  filter: QueryFilter[];
  or: QueryFilter[];
  join: QueryJoin[];
  sort: QuerySort[];
  limit: number;
  offset: number;
  page: number;
  cache: number;
}

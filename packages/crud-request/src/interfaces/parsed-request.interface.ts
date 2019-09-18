import {
  QueryFields,
  QueryFilter,
  QueryJoin,
  QuerySort,
  QuerySearchParsed,
} from '../types';

export interface ParsedRequestParams {
  fields: QueryFields;
  paramsFilter: QueryFilter[];
  search: QuerySearchParsed;
  filter: QueryFilter[];
  or: QueryFilter[];
  join: QueryJoin[];
  sort: QuerySort[];
  limit: number;
  offset: number;
  page: number;
  cache: number;
}

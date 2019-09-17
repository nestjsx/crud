import { QueryFields, QuerySearch, QueryFilter, QueryJoin, QuerySort } from '../types';

export interface CreateQueryParams {
  fields?: QueryFields;
  search?: QuerySearch;
  filter?: QueryFilter[];
  or?: QueryFilter[];
  join?: QueryJoin[];
  sort?: QuerySort[];
  limit?: number;
  offset?: number;
  page?: number;
  resetCache?: boolean;
}

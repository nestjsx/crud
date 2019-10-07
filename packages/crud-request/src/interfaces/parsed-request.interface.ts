import {
  QueryField,
  QueryFields,
  QueryFilter,
  QueryGroup,
  QueryJoin,
  QuerySort,
  SCondition,
} from '../types';

export interface ParsedRequestParams {
  fields: QueryFields;
  paramsFilter: Array<QueryFilter<string>>;
  search: SCondition;
  filter: Array<QueryFilter<QueryField>>;
  or: Array<QueryFilter<QueryField>>;
  join: QueryJoin[];
  group: QueryGroup;
  sort: QuerySort[];
  limit: number;
  offset: number;
  page: number;
  cache: number;
  raw: boolean;
}

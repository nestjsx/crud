import {
  QueryField,
  QueryFields,
  QueryFilter,
  QueryFilterArr,
  QueryGroup,
  QueryJoin,
  QueryJoinArr,
  QuerySort,
  QuerySortArr,
  SCondition,
} from '../types';

export interface CreateQueryParams {
  fields?: QueryFields;
  search?: SCondition;
  filter?:
    | QueryFilter<QueryField>
    | QueryFilterArr
    | Array<QueryFilter<QueryField> | QueryFilterArr>;
  or?:
    | QueryFilter<QueryField>
    | QueryFilterArr
    | Array<QueryFilter<QueryField> | QueryFilterArr>;
  join?: QueryJoin | QueryJoinArr | Array<QueryJoin | QueryJoinArr>;
  sort?: QuerySort | QuerySortArr | Array<QuerySort | QuerySortArr>;
  limit?: number;
  offset?: number;
  page?: number;
  resetCache?: boolean;
  group?: QueryGroup;
  raw?: boolean;
}

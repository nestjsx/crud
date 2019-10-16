import {
  FieldAlias,
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
  sort?:
    | QuerySort<string | FieldAlias>
    | QuerySortArr<string | FieldAlias>
    | Array<QuerySort<string | FieldAlias> | QuerySortArr<string | FieldAlias>>;
  limit?: number;
  offset?: number;
  page?: number;
  resetCache?: boolean;
  group?: QueryGroup;
  raw?: boolean;
}

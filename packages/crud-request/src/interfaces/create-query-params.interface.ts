import {
  QueryFields,
  QueryFilter,
  QueryFilterArr,
  QueryJoin,
  QueryJoinArr,
  QuerySort,
  QuerySortArr,
  SCondition,
} from '../types';

export interface CreateQueryParams<K extends string = string> {
  fields?: QueryFields<K>;
  search?: SCondition<K>;
  filter?: QueryFilter<K> | QueryFilterArr<K> | Array<QueryFilter<K> | QueryFilterArr<K>>;
  or?: QueryFilter<K> | QueryFilterArr<K> | Array<QueryFilter<K> | QueryFilterArr<K>>;
  join?: QueryJoin<K> | QueryJoinArr<K> | Array<QueryJoin<K> | QueryJoinArr<K>>;
  sort?: QuerySort<K> | QuerySortArr<K> | Array<QuerySort<K> | QuerySortArr<K>>;
  limit?: number;
  offset?: number;
  page?: number;
  resetCache?: boolean;
}

import {
  QueryFilter,
  SCondition,
} from '@nestjsx/crud-request/src/types/request-query.types';

export type QueryFilterFunction = (
  search?: SCondition,
  getMany?: boolean,
) => SCondition | void;
export type QueryFilterOption = QueryFilter[] | SCondition | QueryFilterFunction;

import { QueryFilter, SCondition } from '@vianneybr/nestjsx-crud-request/lib/types/request-query.types';

export type QueryFilterFunction = (search?: SCondition, getMany?: boolean) => SCondition | void;
export type QueryFilterOption = QueryFilter[] | SCondition | QueryFilterFunction;

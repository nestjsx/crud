import { QueryFilter, SCondition } from '@nestjsx/crud-request/lib/types/request-query.types';
export declare type QueryFilterFunction = (search?: SCondition, getMany?: boolean) => SCondition | void;
export declare type QueryFilterOption = QueryFilter[] | SCondition | QueryFilterFunction;

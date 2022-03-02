import { QueryFields, QueryFilter, QueryFilterArr, QueryJoin, QueryJoinArr, QuerySort, QuerySortArr, SCondition } from '../types';
export interface CreateQueryParams {
    fields?: QueryFields;
    search?: SCondition;
    filter?: QueryFilter | QueryFilterArr | Array<QueryFilter | QueryFilterArr>;
    or?: QueryFilter | QueryFilterArr | Array<QueryFilter | QueryFilterArr>;
    join?: QueryJoin | QueryJoinArr | Array<QueryJoin | QueryJoinArr>;
    sort?: QuerySort | QuerySortArr | Array<QuerySort | QuerySortArr>;
    limit?: number;
    offset?: number;
    page?: number;
    resetCache?: boolean;
    includeDeleted?: number;
}

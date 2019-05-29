import { QueryFields, QueryFilter, QuerySort } from '@nestjsx/request-query/lib/types/request-query.types';
export interface QueryOptions {
    allow?: QueryFields;
    exclude?: QueryFields;
    persist?: QueryFields;
    filter?: QueryFilter[];
    join?: JoinOptions;
    sort?: QuerySort[];
    limit?: number;
    maxLimit?: number;
    cache?: number | false;
}
export interface JoinOptions {
    [key: string]: {
        allow?: string[];
        exclude?: string[];
        persist?: string[];
        eager: boolean;
    };
}

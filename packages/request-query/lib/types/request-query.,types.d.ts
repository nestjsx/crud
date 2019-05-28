export declare type QueryFields = string[];
export declare type QueryFilter = {
    field: string;
    operator: ComparisonOperator;
    value?: any;
};
export declare type QueryJoin = {
    field: string;
    select?: string[];
};
export declare type QuerySort = {
    field: string;
    order: 'ASC' | 'DESC';
};
export declare type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'starts' | 'ends' | 'cont' | 'excl' | 'in' | 'notin' | 'isnull' | 'notnull' | 'between';

export declare type QueryFields = string[];
export declare type QueryFilter = {
    field: string;
    operator: ComparisonOperator;
    value?: any;
};
export declare type QueryJoin = {
    field: string;
    select?: QueryFields;
};
export declare type QuerySort = {
    field: string;
    order: 'ASC' | 'DESC';
};
export declare type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'starts' | 'ends' | 'cont' | 'excl' | 'in' | 'notin' | 'isnull' | 'notnull' | 'between';
export declare enum CondOperator {
    EQUALS = "eq",
    NOT_EQUALS = "ne",
    GREATER_THAN = "gt",
    LOWER_THAN = "lt",
    GREATER_THAN_EQUALS = "gte",
    LOWER_THAN_EQAULS = "lt",
    STARTS = "starts",
    ENDS = "ends",
    CONTAINS = "contains",
    EXCLUDES = "excl",
    IN = "in",
    NOT_IN = "notin",
    IS_NULL = "isnull",
    NOT_NULL = "notnull",
    BETWEEN = "between"
}

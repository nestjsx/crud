export declare type QueryFields = string[];
export declare type QueryFilter = {
    field: string;
    operator: ComparisonOperator;
    value?: any;
};
export declare type QueryFilterArr = [string, ComparisonOperator, any?];
export declare type QueryJoin = {
    field: string;
    select?: QueryFields;
};
export declare type QueryJoinArr = [string, QueryFields?];
export declare type QuerySort = {
    field: string;
    order: QuerySortOperator;
};
export declare type QuerySortArr = [string, QuerySortOperator];
export declare type QuerySortOperator = 'ASC' | 'DESC';
declare type DeprecatedCondOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'starts' | 'ends' | 'cont' | 'excl' | 'in' | 'notin' | 'isnull' | 'notnull' | 'between';
export declare enum CondOperator {
    EQUALS = "$eq",
    NOT_EQUALS = "$ne",
    GREATER_THAN = "$gt",
    LOWER_THAN = "$lt",
    GREATER_THAN_EQUALS = "$gte",
    LOWER_THAN_EQUALS = "$lte",
    STARTS = "$starts",
    ENDS = "$ends",
    CONTAINS = "$cont",
    EXCLUDES = "$excl",
    IN = "$in",
    NOT_IN = "$notin",
    IS_NULL = "$isnull",
    NOT_NULL = "$notnull",
    BETWEEN = "$between",
    EQUALS_LOW = "$eqL",
    NOT_EQUALS_LOW = "$neL",
    STARTS_LOW = "$startsL",
    ENDS_LOW = "$endsL",
    CONTAINS_LOW = "$contL",
    EXCLUDES_LOW = "$exclL",
    IN_LOW = "$inL",
    NOT_IN_LOW = "$notinL"
}
export declare type ComparisonOperator = DeprecatedCondOperator | keyof SFieldOperator;
export declare type SPrimitivesVal = string | number | boolean;
export declare type SFiledValues = SPrimitivesVal | Array<SPrimitivesVal>;
export declare type SFieldOperator = {
    $eq?: SFiledValues;
    $ne?: SFiledValues;
    $gt?: SFiledValues;
    $lt?: SFiledValues;
    $gte?: SFiledValues;
    $lte?: SFiledValues;
    $starts?: SFiledValues;
    $ends?: SFiledValues;
    $cont?: SFiledValues;
    $excl?: SFiledValues;
    $in?: SFiledValues;
    $notin?: SFiledValues;
    $between?: SFiledValues;
    $isnull?: SFiledValues;
    $notnull?: SFiledValues;
    $eqL?: SFiledValues;
    $neL?: SFiledValues;
    $startsL?: SFiledValues;
    $endsL?: SFiledValues;
    $contL?: SFiledValues;
    $exclL?: SFiledValues;
    $inL?: SFiledValues;
    $notinL?: SFiledValues;
    $or?: SFieldOperator;
    $and?: never;
};
export declare type SField = SPrimitivesVal | SFieldOperator;
export declare type SFields = {
    [key: string]: SField | Array<SFields | SConditionAND> | undefined;
    $or?: Array<SFields | SConditionAND>;
    $and?: never;
};
export declare type SConditionAND = {
    $and?: Array<SFields | SConditionAND>;
    $or?: never;
};
export declare type SConditionKey = '$and' | '$or';
export declare type SCondition = SFields | SConditionAND;
export {};

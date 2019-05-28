import { QueryFields, QueryFilter, ComparisonOperator, QueryJoin, QuerySort } from './types';
export declare const comparisonOperatorsList: string[];
export declare const sortOrdersList: string[];
export declare function validateFields(fields: QueryFields): void;
export declare function validateCondition(val: QueryFilter, cond: 'filter' | 'or'): void;
export declare function validateComparisonOperator(operator: ComparisonOperator): void;
export declare function validateJoin(join: QueryJoin): void;
export declare function validateSort(sort: QuerySort): void;
export declare function validateNumeric(val: number, num: 'limit' | 'offset' | 'page'): void;

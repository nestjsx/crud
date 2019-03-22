import { ComparisonOperator } from '../types';
export declare class FilterParamDto {
    field: string;
    operator: ComparisonOperator;
    value?: any;
}

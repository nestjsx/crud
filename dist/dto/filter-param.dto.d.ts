import { ComparisonOperator } from '../operators.list';
export declare class FilterParamDto {
    field: string;
    operator: ComparisonOperator;
    value?: any;
}

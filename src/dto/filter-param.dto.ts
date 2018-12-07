import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

import { COMPARISON_OPERATORS, ComparisonOperator } from '../operators.list';

export class FilterParamDto {
  @IsNotEmpty()
  @IsString()
  field: string;

  @IsNotEmpty()
  @IsIn(COMPARISON_OPERATORS)
  operator: ComparisonOperator;

  @IsOptional()
  value?: any;
}

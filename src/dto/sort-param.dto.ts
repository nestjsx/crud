import { IsString, IsNotEmpty, IsIn } from 'class-validator';

import { ORDER_BY } from '../operators.list';

export class SortParamDto {
  @IsNotEmpty()
  @IsString()
  field: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(ORDER_BY)
  order: string;
}

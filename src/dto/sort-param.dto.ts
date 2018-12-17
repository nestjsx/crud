import { mockValidatorDecorator } from '../utils';
import { ORDER_BY } from '../operators.list';

const IsNotEmpty = mockValidatorDecorator('IsNotEmpty');
const IsString = mockValidatorDecorator('IsString');
const IsIn = mockValidatorDecorator('IsIn');

export class SortParamDto {
  @IsNotEmpty()
  @IsString()
  field: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(ORDER_BY)
  order: string;
}

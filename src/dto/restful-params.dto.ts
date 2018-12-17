import { mockValidatorDecorator, mockTransformerDecorator } from '../utils';
import { FilterParamDto } from './filter-param.dto';
import { SortParamDto } from './sort-param.dto';
import { JoinParamDto } from './join-param.dto';

const IsOptional = mockValidatorDecorator('IsOptional');
const IsString = mockValidatorDecorator('IsString');
const IsNumber = mockValidatorDecorator('IsNumber');
const ValidateNested = mockValidatorDecorator('ValidateNested');
const Type = mockTransformerDecorator('Type');

export class RestfulParamsDto {
  @IsOptional()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type((t) => FilterParamDto)
  filter?: FilterParamDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type((t) => FilterParamDto)
  or?: FilterParamDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type((t) => JoinParamDto)
  join?: JoinParamDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type((t) => SortParamDto)
  sort?: SortParamDto[];

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  cache?: number;
}

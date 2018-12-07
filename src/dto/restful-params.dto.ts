import { IsNumber, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { FilterParamDto } from './filter-param.dto';
import { SortParamDto } from './sort-param.dto';
import { JoinParamDto } from './join-param.dto';

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

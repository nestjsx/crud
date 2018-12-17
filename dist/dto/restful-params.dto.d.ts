import { FilterParamDto } from './filter-param.dto';
import { SortParamDto } from './sort-param.dto';
import { JoinParamDto } from './join-param.dto';
export declare class RestfulParamsDto {
    fields?: string[];
    filter?: FilterParamDto[];
    or?: FilterParamDto[];
    join?: JoinParamDto[];
    sort?: SortParamDto[];
    limit?: number;
    offset?: number;
    page?: number;
    cache?: number;
}

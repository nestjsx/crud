import { PipeTransform } from '@nestjs/common';
import { RequestParamsParsed } from '../interfaces';
import { RequestQueryParams } from '../interfaces/request-query-params.interface';
export declare class RestfulQueryPipe implements PipeTransform {
    private delim;
    private delimStr;
    private reservedFields;
    transform(query: RequestQueryParams): RequestParamsParsed;
    private splitString;
    private parseInt;
    private parseFilter;
    private parseSort;
    private parseJoin;
    private parseArray;
    private parseEntityFields;
}

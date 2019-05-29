import { RequestQueryBuilderOptions } from './interfaces';
import { QueryFields, QueryFilter, QueryJoin, QuerySort } from './types';
export declare class RequestQueryParser {
    private _query;
    private _paramNames;
    fields: QueryFields;
    filter: QueryFilter[];
    or: QueryFilter[];
    join: QueryJoin[];
    sort: QuerySort[];
    limit: number;
    offset: number;
    page: number;
    cache: number;
    readonly options: RequestQueryBuilderOptions;
    parse(query: any): this;
    private getParamNames;
    private getParamValues;
    private parseParam;
    private parseValue;
    private parseValues;
    private fieldsParser;
    private conditionParser;
    private joinParser;
    private sortParser;
    private numericParser;
}

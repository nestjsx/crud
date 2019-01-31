import { RestfulService } from '../classes/restful-service.class';
import { RestfulOptions, RequestParamsParsed, FilterParamParsed } from '../interfaces';
export declare class RepositoryService<T> extends RestfulService<T> {
    protected repo: any;
    protected type: any;
    protected options: RestfulOptions;
    private entityColumns;
    private entityColumnsHash;
    private entityRelationsHash;
    constructor(repo: any, type: any);
    private readonly entityType;
    private readonly alias;
    getMany(query?: RequestParamsParsed, options?: RestfulOptions): Promise<T[]>;
    getOne(id: string, { fields, join, cache }?: RequestParamsParsed, options?: RestfulOptions): Promise<T>;
    createOne(data: any, paramsFilter?: FilterParamParsed[]): Promise<T>;
    createMany(data: {
        bulk: any[];
    }, paramsFilter?: FilterParamParsed[]): Promise<T[]>;
    updateOne(id: string, data: any, paramsFilter?: FilterParamParsed[]): Promise<T>;
    deleteOne(id: number, paramsFilter?: FilterParamParsed[]): Promise<void>;
    private getOneOrFail;
    private buildQuery;
    private plainToClass;
    private onInitMapEntityColumns;
    private onInitMapRelations;
    private hasColumn;
    private validateHasColumn;
    private getAllowedColumns;
    private setFindField;
    private getSelect;
    private getSkip;
    private getTake;
    private getSort;
    private mapSort;
    private mapOperatorsToQuery;
}

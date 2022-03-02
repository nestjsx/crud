import { CreateManyDto, CrudRequest, CrudRequestOptions, CrudService, GetManyDefaultResponse, JoinOption, JoinOptions, QueryOptions } from '@nestjsx/crud';
import { ParsedRequestParams, QueryFilter, QueryJoin, QuerySort, SCondition, SConditionKey, ComparisonOperator } from '@nestjsx/crud-request';
import { ClassType } from '@nestjsx/util';
import { Brackets, ObjectLiteral, Repository, SelectQueryBuilder, DeepPartial, WhereExpression, ConnectionOptions, EntityMetadata } from 'typeorm';
interface IAllowedRelation {
    alias?: string;
    nested: boolean;
    name: string;
    path: string;
    columns: string[];
    primaryColumns: string[];
    allowedColumns: string[];
}
export declare class TypeOrmCrudService<T> extends CrudService<T> {
    protected repo: Repository<T>;
    protected dbName: ConnectionOptions['type'];
    protected entityColumns: string[];
    protected entityPrimaryColumns: string[];
    protected entityHasDeleteColumn: boolean;
    protected entityColumnsHash: ObjectLiteral;
    protected entityRelationsHash: Map<string, IAllowedRelation>;
    protected sqlInjectionRegEx: RegExp[];
    constructor(repo: Repository<T>);
    readonly findOne: Repository<T>['findOne'];
    readonly find: Repository<T>['find'];
    readonly count: Repository<T>['count'];
    protected readonly entityType: ClassType<T>;
    protected readonly alias: string;
    getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
    getOne(req: CrudRequest): Promise<T>;
    createOne(req: CrudRequest, dto: DeepPartial<T>): Promise<T>;
    createMany(req: CrudRequest, dto: CreateManyDto<DeepPartial<T>>): Promise<T[]>;
    updateOne(req: CrudRequest, dto: DeepPartial<T>): Promise<T>;
    recoverOne(req: CrudRequest): Promise<T>;
    replaceOne(req: CrudRequest, dto: DeepPartial<T>): Promise<T>;
    deleteOne(req: CrudRequest): Promise<void | T>;
    getParamFilters(parsed: CrudRequest['parsed']): ObjectLiteral;
    createBuilder(parsed: ParsedRequestParams, options: CrudRequestOptions, many?: boolean, withDeleted?: boolean): Promise<SelectQueryBuilder<T>>;
    protected doGetMany(builder: SelectQueryBuilder<T>, query: ParsedRequestParams, options: CrudRequestOptions): Promise<GetManyDefaultResponse<T> | T[]>;
    protected onInitMapEntityColumns(): void;
    protected getOneOrFail(req: CrudRequest, shallow?: boolean, withDeleted?: boolean): Promise<T>;
    protected prepareEntityBeforeSave(dto: DeepPartial<T>, parsed: CrudRequest['parsed']): T;
    protected getAllowedColumns(columns: string[], options: QueryOptions): string[];
    protected getEntityColumns(entityMetadata: EntityMetadata): {
        columns: string[];
        primaryColumns: string[];
    };
    protected getRelationMetadata(field: string, options: JoinOption): IAllowedRelation;
    protected setJoin(cond: QueryJoin, joinOptions: JoinOptions, builder: SelectQueryBuilder<T>): boolean;
    protected setAndWhere(cond: QueryFilter, i: any, builder: SelectQueryBuilder<T> | WhereExpression): void;
    protected setOrWhere(cond: QueryFilter, i: any, builder: SelectQueryBuilder<T> | WhereExpression): void;
    protected setSearchCondition(builder: SelectQueryBuilder<T>, search: SCondition, condition?: SConditionKey): void;
    protected builderAddBrackets(builder: SelectQueryBuilder<T>, condition: SConditionKey, brackets: Brackets): void;
    protected builderSetWhere(builder: SelectQueryBuilder<T>, condition: SConditionKey, field: string, value: any, operator?: ComparisonOperator): void;
    protected setSearchFieldObjectCondition(builder: SelectQueryBuilder<T>, condition: SConditionKey, field: string, object: any): void;
    protected getSelect(query: ParsedRequestParams, options: QueryOptions): string[];
    protected getSort(query: ParsedRequestParams, options: QueryOptions): ObjectLiteral;
    protected getFieldWithAlias(field: string, sort?: boolean): string;
    protected mapSort(sort: QuerySort[]): ObjectLiteral;
    protected mapOperatorsToQuery(cond: QueryFilter, param: any): {
        str: string;
        params: ObjectLiteral;
    };
    private checkFilterIsArray;
    private checkSqlInjection;
}
export {};

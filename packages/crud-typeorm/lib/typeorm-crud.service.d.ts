import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  CrudRequest,
  CrudRequestOptions,
  CreateManyDto,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { CrudService } from '@nestjsx/crud/lib/services';
import { ParsedRequestParams } from '@nestjsx/crud-request';
export declare class TypeOrmCrudService<T> extends CrudService<T> {
  protected repo: Repository<T>;
  private entityColumns;
  private entityPrimaryColumns;
  private entityColumnsHash;
  private entityRelationsHash;
  constructor(repo: Repository<T>);
  readonly findOne: Repository<T>['findOne'];
  readonly find: Repository<T>['find'];
  private readonly entityType;
  private readonly alias;
  getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;
  getOne(req: CrudRequest): Promise<T>;
  createOne(req: CrudRequest, dto: T): Promise<T>;
  createMany(req: CrudRequest, dto: CreateManyDto<T>): Promise<T[]>;
  updateOne(req: CrudRequest, dto: T): Promise<T>;
  replaceOne(req: CrudRequest, dto: T): Promise<T>;
  deleteOne(req: CrudRequest): Promise<void | T>;
  decidePagination(parsed: ParsedRequestParams, options: CrudRequestOptions): boolean;
  createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many?: boolean,
  ): Promise<SelectQueryBuilder<T>>;
  private onInitMapEntityColumns;
  private onInitMapRelations;
  private getJoinType;
  private getOneOrFail;
  private prepareEntityBeforeSave;
  private hasColumn;
  private hasRelation;
  private validateHasColumn;
  private getAllowedColumns;
  private getRelationMetadata;
  private setJoin;
  private setAndWhere;
  private setOrWhere;
  private getSelect;
  private getSkip;
  private getTake;
  private getSort;
  private mapSort;
  private mapOperatorsToQuery;
}

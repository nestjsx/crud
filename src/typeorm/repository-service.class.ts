import { Brackets, DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

import { RestfulService } from '../classes';
import {
  FilterParamParsed,
  JoinOptions,
  JoinParamParsed,
  ObjectLiteral,
  RequestParamsParsed,
  RestfulOptions,
  RoutesOptions,
  UpdateOneRouteOptions,
  DeleteOneRouteOptions,
} from '../interfaces';
import { isArrayFull } from '../utils';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';

export class RepositoryService<T> extends RestfulService<T> {
  protected options: RestfulOptions = {};

  private entityColumns: string[];
  private entityColumnsHash: ObjectLiteral = {};
  private entityRelationsHash: ObjectLiteral = {};

  constructor(protected repo: Repository<T>) {
    super();

    this.onInitMapEntityColumns();
    this.onInitMapRelations();
  }

  private get entityType(): ClassType<T> {
    return this.repo.target as ClassType<T>;
  }

  private get alias(): string {
    return this.repo.metadata.targetName;
  }

  public decidePagination(query: RequestParamsParsed, mergedOptions: RestfulOptions) {
    return (isFinite(query.page) || isFinite(query.offset)) && !!this.getTake(query, mergedOptions);
  }

  /**
   * Get many entities
   * @param query
   * @param options
   */
  public async getMany(
    query: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ) {
    const builder = await this.buildQuery(query, options);
    const mergedOptions = Object.assign({}, this.options, options);
    if (this.decidePagination(query, mergedOptions)) {
      const [data, total] = await builder.getManyAndCount();
      const limit = builder.expressionMap.take;
      const offset = builder.expressionMap.skip;
      return this.createPageInfo(data, total, limit, offset);
    }
    return builder.getMany();
  }

  /**
   * Get one entity by id
   * @param id
   * @param options
   */
  public async getOne(
    { fields, join, cache }: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ): Promise<T> {
    return this.getOneOrFail(
      {
        fields,
        join,
        cache,
      },
      options,
    );
  }

  /**
   * Create one entity
   * @param data
   * @param params
   */
  public async createOne(data: T, params: FilterParamParsed[]): Promise<T> {
    const entity = this.plainToClass(data, params);

    if (!entity) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    return this.repo.save<any>(entity);
  }

  /**
   * Create many
   * @param data
   * @param params
   */
  public async createMany(
    data: { bulk: DeepPartial<T>[] },
    params: FilterParamParsed[] = [],
  ): Promise<T[]> {
    if (!data || !data.bulk || !data.bulk.length) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const bulk = data.bulk
      .map((one) => this.plainToClass(one as any, params))
      .filter((d) => isObject(d));

    if (!bulk.length) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    return this.repo.save<any>(bulk, { chunk: 50 });
  }

  /**
   * Update one entity
   * @param data
   * @param params
   * @param routesOptions
   */
  public async updateOne(
    data: DeepPartial<T>,
    params: FilterParamParsed[] = [],
    routeOptions: UpdateOneRouteOptions = {},
  ): Promise<T> {
    const found = await this.getOneOrFail({}, { filter: params });

    // make sure params not override
    if (params.length && !routeOptions.allowParamsOverride) {
      for (const filter of params) {
        data[filter.field] = filter.value;
      }
    }

    return this.repo.save<any>({ ...found, ...data });
  }

  /**
   * Delete one entity
   * @param params
   * @param routesOptions
   */
  public async deleteOne(
    params: FilterParamParsed[],
    routeOptions: DeleteOneRouteOptions = {},
  ): Promise<void | T> {
    const found = await this.getOneOrFail({}, { filter: params });
    const deleted = await this.repo.remove(found);

    if (routeOptions.returnDeleted) {
      // set params, because id is undefined
      for (const filter of params) {
        deleted[filter.field] = filter.value;
      }

      return deleted;
    }
  }

  private async getOneOrFail(
    { fields, join, cache }: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ): Promise<T> {
    const builder = await this.buildQuery({ fields, join, cache }, options, false);
    const found = await builder.getOne();

    if (!found) {
      this.throwNotFoundException(this.alias);
    }

    return found;
  }

  /**
   * Do query into DB
   * @param query
   * @param options
   * @param many
   */
  private async buildQuery(
    query: RequestParamsParsed,
    options: RestfulOptions = {},
    many = true,
  ): Promise<SelectQueryBuilder<T>> {
    // merge options
    const mergedOptions = Object.assign({}, this.options, options);
    // get selet fields
    const select = this.getSelect(query, mergedOptions);

    // create query builder
    const builder = this.repo.createQueryBuilder(this.alias);

    // select fields
    builder.select(select);

    // set mandatory where condition
    if (isArrayFull(mergedOptions.filter)) {
      for (let i = 0; i < mergedOptions.filter.length; i++) {
        this.setAndWhere(mergedOptions.filter[i], `mergedOptions${i}`, builder);
      }
    }

    const hasFilter = isArrayFull(query.filter);
    const hasOr = isArrayFull(query.or);

    if (hasFilter && hasOr) {
      if (query.filter.length === 1 && query.or.length === 1) {
        // WHERE :filter OR :or
        this.setOrWhere(query.filter[0], `filter0`, builder);
        this.setOrWhere(query.or[0], `or0`, builder);
      } else if (query.filter.length === 1) {
        this.setAndWhere(query.filter[0], `filter0`, builder);
        builder.orWhere(
          new Brackets((qb) => {
            for (let i = 0; i < query.or.length; i++) {
              this.setAndWhere(query.or[i], `or${i}`, qb as any);
            }
          }),
        );
      } else if (query.or.length === 1) {
        this.setAndWhere(query.or[0], `or0`, builder);
        builder.orWhere(
          new Brackets((qb) => {
            for (let i = 0; i < query.filter.length; i++) {
              this.setAndWhere(query.filter[i], `filter${i}`, qb as any);
            }
          }),
        );
      } else {
        builder.andWhere(
          new Brackets((qb) => {
            for (let i = 0; i < query.filter.length; i++) {
              this.setAndWhere(query.filter[i], `filter${i}`, qb as any);
            }
          }),
        );
        builder.orWhere(
          new Brackets((qb) => {
            for (let i = 0; i < query.or.length; i++) {
              this.setAndWhere(query.or[i], `or${i}`, qb as any);
            }
          }),
        );
      }
    } else if (hasOr) {
      // WHERE :or OR :or OR ...
      for (let i = 0; i < query.or.length; i++) {
        this.setOrWhere(query.or[i], `or${i}`, builder);
      }
    } else if (hasFilter) {
      // WHERE :filter AND :filter AND ...
      for (let i = 0; i < query.filter.length; i++) {
        this.setAndWhere(query.filter[i], `filter${i}`, builder);
      }
    }

    // set joins
    if (isArrayFull(query.join)) {
      const joinOptions = mergedOptions.join || {};

      if (Object.keys(joinOptions).length) {
        for (let i = 0; i < query.join.length; i++) {
          this.setJoin(query.join[i], joinOptions, builder);
        }
      }
    }

    if (many) {
      // set sort (order by)
      const sort = this.getSort(query, mergedOptions);
      builder.orderBy(sort);

      // set take
      const take = this.getTake(query, mergedOptions);
      if (isFinite(take)) {
        builder.take(take);
      }

      // set skip
      const skip = this.getSkip(query, take);
      if (isFinite(skip)) {
        builder.skip(skip);
      }
    }

    // remove cache if nedeed
    if (
      query.cache === 0 &&
      this.repo.metadata.connection.queryResultCache &&
      this.repo.metadata.connection.queryResultCache.remove
    ) {
      const cacheId = this.getCacheId(query, options);
      await this.repo.metadata.connection.queryResultCache.remove([cacheId]);
    }

    // set cache
    if (mergedOptions.cache) {
      const cacheId = this.getCacheId(query, options);
      builder.cache(cacheId, mergedOptions.cache);
    }

    return builder;
  }

  private plainToClass(data: T, params: FilterParamParsed[] = []): T {
    if (!isObject(data)) {
      return undefined;
    }

    if (params.length) {
      for (const filter of params) {
        data[filter.field] = filter.value;
      }
    }

    if (!Object.keys(data).length) {
      return undefined;
    }

    return plainToClass(this.entityType, data);
  }

  private onInitMapEntityColumns() {
    this.entityColumns = this.repo.metadata.columns.map((prop) => {
      this.entityColumnsHash[prop.propertyName] = true;
      return prop.propertyName;
    });
  }

  private onInitMapRelations() {
    this.entityRelationsHash = this.repo.metadata.relations.reduce(
      (hash, curr) => ({
        ...hash,
        [curr.propertyName]: {
          name: curr.propertyName,
          type: this.getJoinType(curr.relationType),
          columns: curr.inverseEntityMetadata.columns.map((col) => col.propertyName),
          referencedColumn: (curr.joinColumns.length
              ? curr.joinColumns[0]
              : curr.inverseRelation.joinColumns[0]
          ).referencedColumn.propertyName,
        },
      }),
      {},
    );
  }

  private getJoinType(relationType: string): string {
    switch (relationType) {
      case 'many-to-one':
      case 'one-to-one':
        return 'innerJoin';

      default:
        return 'leftJoin';
    }
  }

  private hasColumn(column: string): boolean {
    return this.entityColumnsHash[column];
  }

  private hasRelation(column: string): boolean {
    return this.entityRelationsHash[column];
  }

  private validateHasColumn(column: string) {
    if (column.indexOf('.') !== -1) {
      const nests = column.split('.');
      if (nests.length > 2) {
        this.throwBadRequestException('Too many nested levels! ' +
          `Usage: '[join=<other-relation>&]join=[<other-relation>.]<relation>&filter=<relation>.<field>||op||val'`);
      }
      let relation;
      [relation, column] = nests;
      if (!this.hasRelation(relation)) {
        this.throwBadRequestException(`Invalid relation name '${relation}'`);
      }
      const noColumn = !(this.entityRelationsHash[relation].columns as string[]).find(o => o === column);
      if (noColumn) {
        this.throwBadRequestException(`Invalid column name '${column}' for relation '${relation}'`);
      }
    } else {
      if (!this.hasColumn(column)) {
        this.throwBadRequestException(`Invalid column name '${column}'`);
      }
    }
  }

  private getAllowedColumns(columns: string[], options: ObjectLiteral): string[] {
    return (!options.exclude || !options.exclude.length) &&
    (!options.allow || !options.allow.length)
      ? columns
      : columns.filter(
        (column) =>
          (options.exclude && options.exclude.length
            ? !options.exclude.some((col) => col === column)
            : true) &&
          (options.allow && options.allow.length
            ? options.allow.some((col) => col === column)
            : true),
      );
  }

  private getRelationMetadata(field: string) {
    try {
      const fields = field.split('.');
      const target = fields[fields.length - 1];
      const paths = fields.slice(0, fields.length - 1);

      let relations = this.repo.metadata.relations;

      for (const propertyName of paths) {
        relations = relations.find((o) => o.propertyName === propertyName).inverseEntityMetadata
          .relations;
      }

      const relation: RelationMetadata & { nestedRelation?: string } = relations.find(
        (o) => o.propertyName === target,
      );

      relation.nestedRelation = `${fields[fields.length - 2]}.${target}`;

      return relation;
    } catch (e) {
      return null;
    }
  }

  private setJoin(cond: JoinParamParsed, joinOptions: JoinOptions, builder: SelectQueryBuilder<T>) {
    if (this.entityRelationsHash[cond.field] === undefined && cond.field.includes('.')) {
      const curr = this.getRelationMetadata(cond.field);
      if (!curr) {
        this.entityRelationsHash[cond.field] = null;
        return true;
      }

      this.entityRelationsHash[cond.field] = {
        name: curr.propertyName,
        type: this.getJoinType(curr.relationType),
        columns: curr.inverseEntityMetadata.columns.map((col) => col.propertyName),
        referencedColumn: (curr.joinColumns.length
            ? curr.joinColumns[0]
            : curr.inverseRelation.joinColumns[0]
        ).referencedColumn.propertyName,
        nestedRelation: curr.nestedRelation,
      };
    }

    if (cond.field && this.entityRelationsHash[cond.field] && joinOptions[cond.field]) {
      const relation = this.entityRelationsHash[cond.field];
      const options = joinOptions[cond.field];
      const allowed = this.getAllowedColumns(relation.columns, options);

      if (!allowed.length) {
        return true;
      }

      const columns =
        !cond.select || !cond.select.length
          ? allowed
          : cond.select.filter((col) => allowed.some((a) => a === col));

      const select = [
        relation.referencedColumn,
        ...(options.persist && options.persist.length ? options.persist : []),
        ...columns,
      ].map((col) => `${relation.name}.${col}`);

      const relationPath = relation.nestedRelation || `${this.alias}.${relation.name}`;

      builder[relation.type](relationPath, relation.name);
      builder.addSelect(select);
    }

    return true;
  }

  private setAndWhere(cond: FilterParamParsed, i: any, builder: SelectQueryBuilder<T>) {
    this.validateHasColumn(cond.field);
    const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i}`);
    builder.andWhere(str, params);
  }

  private setOrWhere(cond: FilterParamParsed, i: any, builder: SelectQueryBuilder<T>) {
    this.validateHasColumn(cond.field);
    const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i}`);
    builder.orWhere(str, params);
  }

  private getCacheId(query: RequestParamsParsed, options: RestfulOptions): string {
    return JSON.stringify({ query, options, cache: undefined });
  }

  private getSelect(query: RequestParamsParsed, options: RestfulOptions): string[] {
    const allowed = this.getAllowedColumns(this.entityColumns, options);

    const columns =
      query.fields && query.fields.length
        ? query.fields.filter((field) => allowed.some((col) => field === col))
        : allowed;

    const select = [
      ...(options.persist && options.persist.length ? options.persist : []),
      ...columns,
      'id', // always persist ids
    ].map((col) => `${this.alias}.${col}`);

    return select;
  }

  private getSkip(query: RequestParamsParsed, take: number): number | null {
    return query.page && take ? take * (query.page - 1) : query.offset ? query.offset : null;
  }

  private getTake(query: RequestParamsParsed, options: RestfulOptions): number | null {
    if (query.limit) {
      return options.maxLimit
        ? query.limit <= options.maxLimit
          ? query.limit
          : options.maxLimit
        : query.limit;
    }

    if (options.limit) {
      return options.maxLimit
        ? options.limit <= options.maxLimit
          ? options.limit
          : options.maxLimit
        : options.limit;
    }

    return options.maxLimit ? options.maxLimit : null;
  }

  private getSort(query: RequestParamsParsed, options: RestfulOptions) {
    return query.sort && query.sort.length
      ? this.mapSort(query.sort)
      : options.sort && options.sort.length
        ? this.mapSort(options.sort)
        : {};
  }

  private mapSort(sort: ObjectLiteral[]) {
    const params: ObjectLiteral = {};

    for (let i = 0; i < sort.length; i++) {
      this.validateHasColumn(sort[i].field);
      params[`${this.alias}.${sort[i].field}`] = sort[i].order;
    }

    return params;
  }

  private mapOperatorsToQuery(
    cond: FilterParamParsed,
    param: any,
  ): { str: string; params: ObjectLiteral } {
    const field = cond.field.indexOf('.') === -1 ? `${this.alias}.${cond.field}` : cond.field;
    let str: string;
    let params: ObjectLiteral;

    switch (cond.operator) {
      case 'eq':
        str = `${field} = :${param}`;
        break;

      case 'ne':
        str = `${field} != :${param}`;
        break;

      case 'gt':
        str = `${field} > :${param}`;
        break;

      case 'lt':
        str = `${field} < :${param}`;
        break;

      case 'gte':
        str = `${field} >= :${param}`;
        break;

      case 'lte':
        str = `${field} <= :${param}`;
        break;

      case 'starts':
        str = `${field} LIKE :${param}`;
        params = { [param]: `${cond.value}%` };
        break;

      case 'ends':
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}` };
        break;

      case 'cont':
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case 'excl':
        str = `${field} NOT LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case 'in':
        if (!Array.isArray(cond.value) || !cond.value.length) {
          this.throwBadRequestException(`Invalid column '${cond.field}' value`);
        }
        str = `${field} IN (:...${param})`;
        break;

      case 'notin':
        if (!Array.isArray(cond.value) || !cond.value.length) {
          this.throwBadRequestException(`Invalid column '${cond.field}' value`);
        }
        str = `${field} NOT IN (:...${param})`;
        break;

      case 'isnull':
        str = `${field} IS NULL`;
        params = {};
        break;

      case 'notnull':
        str = `${field} IS NOT NULL`;
        params = {};
        break;

      case 'between':
        if (!Array.isArray(cond.value) || !cond.value.length || cond.value.length !== 2) {
          this.throwBadRequestException(`Invalid column '${cond.field}' value`);
        }
        str = `${field} BETWEEN :${param}0 AND :${param}1`;
        params = {
          [`${param}0`]: cond.value[0],
          [`${param}1`]: cond.value[1],
        };
        break;

      default:
        str = `${field} = :${param}`;
        break;
    }

    if (typeof params === 'undefined') {
      params = { [param]: cond.value };
    }

    return { str, params };
  }
}

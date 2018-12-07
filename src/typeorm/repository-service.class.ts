import { Repository, SelectQueryBuilder, Brackets, WhereExpression, FindOneOptions } from 'typeorm';

import { RestfulService } from '../classes/restful-service.class';
import {
  RestfulOptions,
  JoinOptions,
  RequestParamsParsed,
  FilterParamParsed,
  JoinParamParsed,
} from '../interfaces';
import { ObjectLiteral } from '../interfaces/object-literal.interface';

export class RepositoryService<T = any> extends RestfulService<T> {
  options: RestfulOptions = {};

  private alias: string;
  private entityColumns: string[];
  private entityColumnsHash: ObjectLiteral = {};
  private entityRelationsHash: ObjectLiteral = {};

  constructor(protected repo: Repository<T>) {
    super();

    // set alias
    this.alias = this.repo.metadata.targetName;
    // map all entity columns names
    this.onInitMapEntityColumns();
    // map entity relations
    this.onInitMapRelations();
  }

  public async getMany(
    query: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ): Promise<T[]> {
    return this.query(query, options) as Promise<T[]>;
  }

  public async getOne(
    id: number | string,
    { fields, join, cache }: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ): Promise<T> {
    return this.getOneOrFail(
      {
        filter: [{ field: 'id', operator: 'eq', value: id }],
        fields,
        join,
        cache,
      },
      options,
    );
  }

  public async getOneOrFail(
    { filter, fields, join, cache }: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ): Promise<T> {
    const found = (await this.query({ filter, fields, join, cache }, options, false)) as T;

    if (!found) {
      this.throwNotFoundException(this.alias);
    }

    return found;
  }

  public async findOneOrFail(options: FindOneOptions<T>) {
    const found = await this.repo.findOne(options);

    if (!found) {
      this.throwNotFoundException(this.alias);
    }

    return found;
  }

  public async query(
    query: RequestParamsParsed,
    options: RestfulOptions = {},
    many = true,
  ): Promise<T | T[]> {
    // merge options
    const mergedOptions = Object.assign({}, this.options, options);
    // get selet fields
    const select = this.getSelect(query, mergedOptions);

    if (!select.length) {
      return [];
    }

    // create query builder
    const builder = this.repo.createQueryBuilder(this.alias);

    // select fields
    builder.select(select);

    // set mandatory where condition
    if (Array.isArray(mergedOptions.filter) && mergedOptions.filter.length) {
      for (let i = 0; i < mergedOptions.filter.length; i++) {
        this.setAndWhere(mergedOptions.filter[i], `mergedOptions${i}`, builder);
      }
    }

    // set filter conditions
    if (Array.isArray(query.filter) && query.filter.length) {
      for (let i = 0; i < query.filter.length; i++) {
        this.setAndWhere(query.filter[i], i, builder);
      }
    }

    // set OR conditions
    if (Array.isArray(query.or) && query.or.length) {
      builder.andWhere(
        new Brackets((qb) => {
          for (let i = 0; i < query.or.length; i++) {
            this.setOrWhere(query.or[i], i, qb);
          }
        }),
      );
    }

    // set joins
    if (Array.isArray(query.join) && query.join.length) {
      const joinOptions = {
        ...(this.options.join ? this.options.join : {}),
        ...(options.join ? options.join : {}),
      };

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
      if (take) {
        builder.take(take);
      }

      // set skip
      const skip = this.getSkip(query, take);
      if (skip) {
        builder.skip(skip);
      }
    }

    // remove cache if nedeed
    if (
      query.cache === 0 &&
      this.repo.metadata.connection.queryResultCache &&
      this.repo.metadata.connection.queryResultCache.remove
    ) {
      const cacheId = this.getCacheId(query);
      await this.repo.metadata.connection.queryResultCache.remove([cacheId]);
    }

    // set cache
    if (mergedOptions.cache) {
      const cacheId = this.getCacheId(query);
      builder.cache(cacheId, mergedOptions.cache);
    }

    // fire request
    return many ? builder.getMany() : builder.getOne();
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

  private validateHasColumn(column: string) {
    if (!this.hasColumn(column)) {
      this.throwBadRequestException(`Invalid column name '${column}'`);
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

  private setJoin(cond: JoinParamParsed, joinOptions: JoinOptions, builder: SelectQueryBuilder<T>) {
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

      builder[relation.type](`${this.alias}.${relation.name}`, relation.name);
      builder.addSelect(select);
    }

    return true;
  }

  private setAndWhere(cond: FilterParamParsed, i: any, builder: SelectQueryBuilder<T>) {
    this.validateHasColumn(cond.field);
    const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i}`);
    builder.andWhere(str, params);
  }

  private setOrWhere(cond: FilterParamParsed, i: any, qb: WhereExpression) {
    this.validateHasColumn(cond.field);
    const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i}`);
    qb.orWhere(str, params);
  }

  private getCacheId(query: RequestParamsParsed): string {
    return JSON.stringify({ ...query, cache: undefined });
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
      'id',
    ].map((col) => `${this.alias}.${col}`);

    return select;
  }

  private getSkip(query: RequestParamsParsed, take: number): number {
    return query.page && take ? take * (query.page - 1) : query.offset ? query.offset : 0;
  }

  private getTake(query: RequestParamsParsed, options: RestfulOptions): number {
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

    return options.maxLimit ? options.maxLimit : 0;
  }

  private getSort(query: RequestParamsParsed, options: RestfulOptions) {
    return query.sort && query.sort.length
      ? this.mapSort(query.sort)
      : options.sort && options.sort.length
      ? this.mapSort(options.sort)
      : {};
  }

  private mapSort(sort: ObjectLiteral[]) {
    let params: ObjectLiteral = {};

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
    const field = `${this.alias}.${cond.field}`;
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
        str = `${field} IN (:...${param})`;
        break;

      case 'notin':
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
        if (!Array.isArray(cond.value) || !cond.value.length || cond.value.length != 2) {
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

import { Repository, ObjectLiteral, SelectQueryBuilder, Brackets } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { ClassType } from 'class-transformer/ClassTransformer';
import {
  CrudRequest,
  CrudRequestOptions,
  CreateManyDto,
  QueryOptions,
  JoinOptions,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { CrudService } from '@nestjsx/crud/lib/services';
import {
  QueryJoin,
  QueryFilter,
  QuerySort,
  ParsedRequestParams,
} from '@nestjsx/crud-request';
import { isArrayFull } from '@nestjsx/util';

export class TypeOrmCrudService<T> extends CrudService<T> {
  private entityColumns: string[];
  private entityPrimaryColumns: string[];
  private entityColumnsHash: ObjectLiteral = {};
  private entityRelationsHash: ObjectLiteral = {};

  constructor(protected repo: Repository<T>) {
    super();

    this.onInitMapEntityColumns();
    this.onInitMapRelations();
  }

  public get findOne(): Repository<T>['findOne'] {
    return this.repo.findOne.bind(this.repo);
  }

  public get find(): Repository<T>['find'] {
    return this.repo.find.bind(this.repo);
  }

  private get entityType(): ClassType<T> {
    return this.repo.target as ClassType<T>;
  }

  private get alias(): string {
    return this.repo.metadata.targetName;
  }

  public async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const { parsed, options } = req;
    const builder = await this.createBuilder(parsed, options);

    if (this.decidePagination(parsed, options)) {
      const [data, total] = await builder.getManyAndCount();
      const limit = builder.expressionMap.take;
      const offset = builder.expressionMap.skip;

      return this.createPageInfo(data, total, limit, offset);
    }

    return builder.getMany();
  }

  public async getOne(req: CrudRequest): Promise<T> {
    return undefined;
  }

  public async createOne(req: CrudRequest, dto: T): Promise<T> {
    return undefined;
  }

  public async createMany(req: CrudRequest, dto: CreateManyDto<T>): Promise<T[]> {
    return [];
  }

  public async updateOne(req: CrudRequest, dto: T): Promise<T> {
    return undefined;
  }

  public async deleteOne(req: CrudRequest): Promise<void | T> {
    return undefined;
  }

  public decidePagination(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
  ): boolean {
    return (
      (Number.isFinite(parsed.page) || Number.isFinite(parsed.offset)) &&
      !!this.getTake(parsed, options.query)
    );
  }

  public async createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many = true,
  ): Promise<SelectQueryBuilder<T>> {
    // create query builder
    const builder = this.repo.createQueryBuilder(this.alias);

    // get selet fields
    const select = this.getSelect(parsed, options.query);

    // select fields
    builder.select(select);

    // set mandatory where condition from CrudOptions.query.filter
    if (isArrayFull(options.query.filter)) {
      for (let i = 0; i < options.query.filter.length; i++) {
        this.setAndWhere(options.query.filter[i], `optionsFilter${i}`, builder);
      }
    }

    const filters = [...parsed.paramsFilter, ...parsed.filter];
    const hasFilter = isArrayFull(filters);
    const hasOr = isArrayFull(parsed.or);

    if (hasFilter && hasOr) {
      if (filters.length === 1 && parsed.or.length === 1) {
        // WHERE :filter OR :or
        this.setOrWhere(filters[0], `filter0`, builder);
        this.setOrWhere(parsed.or[0], `or0`, builder);
      } else if (filters.length === 1) {
        this.setAndWhere(filters[0], `filter0`, builder);
        builder.orWhere(
          new Brackets((qb) => {
            for (let i = 0; i < parsed.or.length; i++) {
              this.setAndWhere(parsed.or[i], `or${i}`, qb as any);
            }
          }),
        );
      } else if (parsed.or.length === 1) {
        this.setAndWhere(parsed.or[0], `or0`, builder);
        builder.orWhere(
          new Brackets((qb) => {
            for (let i = 0; i < filters.length; i++) {
              this.setAndWhere(filters[i], `filter${i}`, qb as any);
            }
          }),
        );
      } else {
        builder.andWhere(
          new Brackets((qb) => {
            for (let i = 0; i < filters.length; i++) {
              this.setAndWhere(filters[i], `filter${i}`, qb as any);
            }
          }),
        );
        builder.orWhere(
          new Brackets((qb) => {
            for (let i = 0; i < parsed.or.length; i++) {
              this.setAndWhere(parsed.or[i], `or${i}`, qb as any);
            }
          }),
        );
      }
    } else if (hasOr) {
      // WHERE :or OR :or OR ...
      for (let i = 0; i < parsed.or.length; i++) {
        this.setOrWhere(parsed.or[i], `or${i}`, builder);
      }
    } else if (hasFilter) {
      // WHERE :filter AND :filter AND ...
      for (let i = 0; i < filters.length; i++) {
        this.setAndWhere(filters[i], `filter${i}`, builder);
      }
    }

    // set joins
    if (isArrayFull(parsed.join)) {
      const joinOptions = options.query.join || {};

      if (Object.keys(joinOptions).length) {
        for (let i = 0; i < parsed.join.length; i++) {
          this.setJoin(parsed.join[i], joinOptions, builder);
        }
      }
    }

    if (many) {
      // set sort (order by)
      const sort = this.getSort(parsed, options.query);
      builder.orderBy(sort);

      // set take
      const take = this.getTake(parsed, options.query);
      if (isFinite(take)) {
        builder.take(take);
      }

      // set skip
      const skip = this.getSkip(parsed, take);
      if (isFinite(skip)) {
        builder.skip(skip);
      }
    }

    // set cache
    if (options.query.cache && parsed.cache !== 0) {
      builder.cache(builder.getQueryAndParameters(), options.query.cache);
    }

    return builder;
  }

  private onInitMapEntityColumns() {
    this.entityColumns = this.repo.metadata.columns.map((prop) => {
      this.entityColumnsHash[prop.propertyName] = true;
      return prop.propertyName;
    });
    this.entityPrimaryColumns = this.repo.metadata.columns
      .filter((prop) => prop.isPrimary)
      .map((prop) => prop.propertyName);
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
        this.throwBadRequestException(
          'Too many nested levels! ' +
            `Usage: '[join=<other-relation>&]join=[<other-relation>.]<relation>&filter=<relation>.<field>||op||val'`,
        );
      }

      let relation;
      [relation, column] = nests;

      if (!this.hasRelation(relation)) {
        this.throwBadRequestException(`Invalid relation name '${relation}'`);
      }

      const noColumn = !(this.entityRelationsHash[relation].columns as string[]).find(
        (o) => o === column,
      );

      if (noColumn) {
        this.throwBadRequestException(
          `Invalid column name '${column}' for relation '${relation}'`,
        );
      }
    } else {
      if (!this.hasColumn(column)) {
        this.throwBadRequestException(`Invalid column name '${column}'`);
      }
    }
  }

  private getAllowedColumns(columns: string[], options: QueryOptions): string[] {
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
        relations = relations.find((o) => o.propertyName === propertyName)
          .inverseEntityMetadata.relations;
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

  private setJoin(
    cond: QueryJoin,
    joinOptions: JoinOptions,
    builder: SelectQueryBuilder<T>,
  ) {
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
  private setAndWhere(cond: QueryFilter, i: any, builder: SelectQueryBuilder<T>) {
    this.validateHasColumn(cond.field);
    const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i}`);
    builder.andWhere(str, params);
  }

  private setOrWhere(cond: QueryFilter, i: any, builder: SelectQueryBuilder<T>) {
    this.validateHasColumn(cond.field);
    const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i}`);
    builder.orWhere(str, params);
  }

  private getSelect(query: ParsedRequestParams, options: QueryOptions): string[] {
    const allowed = this.getAllowedColumns(this.entityColumns, options);

    const columns =
      query.fields && query.fields.length
        ? query.fields.filter((field) => allowed.some((col) => field === col))
        : allowed;

    const select = [
      ...(options.persist && options.persist.length ? options.persist : []),
      ...columns,
      ...this.entityPrimaryColumns,
    ].map((col) => `${this.alias}.${col}`);

    return select;
  }

  private getSkip(query: ParsedRequestParams, take: number): number | null {
    return query.page && take
      ? take * (query.page - 1)
      : query.offset
      ? query.offset
      : null;
  }

  private getTake(query: ParsedRequestParams, options: QueryOptions): number | null {
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

  private getSort(query: ParsedRequestParams, options: QueryOptions) {
    return query.sort && query.sort.length
      ? this.mapSort(query.sort)
      : options.sort && options.sort.length
      ? this.mapSort(options.sort)
      : {};
  }
  private mapSort(sort: QuerySort[]) {
    const params: ObjectLiteral = {};

    for (let i = 0; i < sort.length; i++) {
      this.validateHasColumn(sort[i].field);
      params[`${this.alias}.${sort[i].field}`] = sort[i].order;
    }

    return params;
  }

  private mapOperatorsToQuery(
    cond: QueryFilter,
    param: any,
  ): { str: string; params: ObjectLiteral } {
    const field =
      cond.field.indexOf('.') === -1 ? `${this.alias}.${cond.field}` : cond.field;
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

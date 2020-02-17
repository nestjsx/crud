import {
  CreateManyDto,
  CrudRequest,
  CrudRequestOptions,
  CrudService,
  GetManyDefaultResponse,
  JoinOptions,
  QueryOptions,
} from '@nestjsx/crud';
import {
  ParsedRequestParams,
  QueryFilter,
  QueryJoin,
  QuerySort,
  SCondition,
  SConditionKey,
  ComparisonOperator,
} from '@nestjsx/crud-request';
import {
  hasLength,
  isArrayFull,
  isObject,
  isUndefined,
  objKeys,
  isNil,
  isNull,
} from '@nestjsx/util';
import { oO } from '@zmotivat0r/o0';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import {
  Brackets,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
  DeepPartial,
  WhereExpression,
  ConnectionOptions,
} from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';

export class TypeOrmCrudService<T> extends CrudService<T> {
  protected dbName: ConnectionOptions['type'];
  protected entityColumns: string[];
  protected entityPrimaryColumns: string[];
  protected entityColumnsHash: ObjectLiteral = {};
  protected entityRelationsHash: ObjectLiteral = {};

  constructor(protected repo: Repository<T>) {
    super();

    this.dbName = this.repo.metadata.connection.options.type;
    this.onInitMapEntityColumns();
    this.onInitMapRelations();
  }

  public get findOne(): Repository<T>['findOne'] {
    return this.repo.findOne.bind(this.repo);
  }

  public get find(): Repository<T>['find'] {
    return this.repo.find.bind(this.repo);
  }

  public get count(): Repository<T>['count'] {
    return this.repo.count.bind(this.repo);
  }

  protected get entityType(): ClassType<T> {
    return this.repo.target as ClassType<T>;
  }

  protected get alias(): string {
    return this.repo.metadata.targetName;
  }

  /**
   * Get many
   * @param req
   */
  public async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const { parsed, options } = req;
    const builder = await this.createBuilder(parsed, options);
    return this.doGetMany(builder, parsed, options);
  }

  /**
   * Get one
   * @param req
   */
  public async getOne(req: CrudRequest): Promise<T> {
    return this.getOneOrFail(req);
  }

  /**
   * Create one
   * @param req
   * @param dto
   */
  public async createOne(req: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    const { returnShallow } = req.options.routes.createOneBase;
    const entity = this.prepareEntityBeforeSave(dto, req.parsed);

    /* istanbul ignore if */
    if (!entity) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const saved = await this.repo.save<any>(entity);

    if (returnShallow) {
      return saved;
    } else {
      const primaryParam = this.getPrimaryParam(req.options);

      /* istanbul ignore if */
      if (!primaryParam && /* istanbul ignore next */ isNil(saved[primaryParam])) {
        return saved;
      } else {
        req.parsed.search = { [primaryParam]: saved[primaryParam] };
        return this.getOneOrFail(req);
      }
    }
  }

  /**
   * Create many
   * @param req
   * @param dto
   */
  public async createMany(
    req: CrudRequest,
    dto: CreateManyDto<DeepPartial<T>>,
  ): Promise<T[]> {
    /* istanbul ignore if */
    if (!isObject(dto) || !isArrayFull(dto.bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const bulk = dto.bulk
      .map((one) => this.prepareEntityBeforeSave(one, req.parsed))
      .filter((d) => !isUndefined(d));

    /* istanbul ignore if */
    if (!hasLength(bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    return this.repo.save<any>(bulk, { chunk: 50 });
  }

  /**
   * Update one
   * @param req
   * @param dto
   */
  public async updateOne(req: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    const { allowParamsOverride, returnShallow } = req.options.routes.updateOneBase;
    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    const toSave = !allowParamsOverride
      ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...found, ...dto, ...req.parsed.authPersist };
    const updated = await this.repo.save(plainToClass(this.entityType, toSave));

    if (returnShallow) {
      return updated;
    } else {
      req.parsed.paramsFilter.forEach((filter) => {
        filter.value = updated[filter.field];
      });

      return this.getOneOrFail(req);
    }
  }

  /**
   * Replace one
   * @param req
   * @param dto
   */
  public async replaceOne(req: CrudRequest, dto: DeepPartial<T>): Promise<T> {
    const { allowParamsOverride, returnShallow } = req.options.routes.replaceOneBase;
    const paramsFilters = this.getParamFilters(req.parsed);
    const [_, found] = await oO(this.getOneOrFail(req, returnShallow));
    const toSave = !allowParamsOverride
      ? { ...(found || {}), ...dto, ...paramsFilters, ...req.parsed.authPersist }
      : {
          ...(found || /* istanbul ignore next */ {}),
          ...paramsFilters,
          ...dto,
          ...req.parsed.authPersist,
        };
    const replaced = await this.repo.save(plainToClass(this.entityType, toSave));

    if (returnShallow) {
      return replaced;
    } else {
      const primaryParam = this.getPrimaryParam(req.options);

      /* istanbul ignore if */
      if (!primaryParam) {
        return replaced;
      }

      req.parsed.search = { [primaryParam]: replaced[primaryParam] };
      return this.getOneOrFail(req);
    }
  }

  /**
   * Delete one
   * @param req
   */
  public async deleteOne(req: CrudRequest): Promise<void | T> {
    const { returnDeleted } = req.options.routes.deleteOneBase;
    const found = await this.getOneOrFail(req, returnDeleted);
    const toReturn = returnDeleted
      ? plainToClass(this.entityType, { ...found })
      : undefined;
    const deleted = await this.repo.remove(found);

    return toReturn;
  }

  public getParamFilters(parsed: CrudRequest['parsed']): ObjectLiteral {
    let filters = {};

    /* istanbul ignore else */
    if (hasLength(parsed.paramsFilter)) {
      for (const filter of parsed.paramsFilter) {
        filters[filter.field] = filter.value;
      }
    }

    return filters;
  }

  public decidePagination(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
  ): boolean {
    return (
      options.query.alwaysPaginate ||
      ((Number.isFinite(parsed.page) || Number.isFinite(parsed.offset)) &&
        !!this.getTake(parsed, options.query))
    );
  }

  /**
   * Create TypeOrm QueryBuilder
   * @param parsed
   * @param options
   * @param many
   */
  public async createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many = true,
  ): Promise<SelectQueryBuilder<T>> {
    // create query builder
    const builder = this.repo.createQueryBuilder(this.alias);
    // get select fields
    const select = this.getSelect(parsed, options.query);
    // select fields
    builder.select(select);

    // search
    this.setSearchCondition(builder, parsed.search);

    // set joins
    const joinOptions = options.query.join || {};
    const allowedJoins = objKeys(joinOptions);

    if (hasLength(allowedJoins)) {
      const eagerJoins: any = {};

      for (let i = 0; i < allowedJoins.length; i++) {
        /* istanbul ignore else */
        if (joinOptions[allowedJoins[i]].eager) {
          const cond = parsed.join.find((j) => j && j.field === allowedJoins[i]) || {
            field: allowedJoins[i],
          };
          this.setJoin(cond, joinOptions, builder);
          eagerJoins[allowedJoins[i]] = true;
        }
      }

      if (isArrayFull(parsed.join)) {
        for (let i = 0; i < parsed.join.length; i++) {
          /* istanbul ignore else */
          if (!eagerJoins[parsed.join[i].field]) {
            this.setJoin(parsed.join[i], joinOptions, builder);
          }
        }
      }
    }

    /* istanbul ignore else */
    if (many) {
      // set sort (order by)
      const sort = this.getSort(parsed, options.query);
      builder.orderBy(sort);

      // set take
      const take = this.getTake(parsed, options.query);
      /* istanbul ignore else */
      if (isFinite(take)) {
        builder.take(take);
      }

      // set skip
      const skip = this.getSkip(parsed, take);
      /* istanbul ignore else */
      if (isFinite(skip)) {
        builder.skip(skip);
      }
    }

    // set cache
    /* istanbul ignore else */
    if (options.query.cache && parsed.cache !== 0) {
      builder.cache(builder.getQueryAndParameters(), options.query.cache);
    }

    return builder;
  }

  /**
   * depends on paging call `SelectQueryBuilder#getMany` or `SelectQueryBuilder#getManyAndCount`
   * helpful for overriding `TypeOrmCrudService#getMany`
   * @see getMany
   * @see SelectQueryBuilder#getMany
   * @see SelectQueryBuilder#getManyAndCount
   * @param builder
   * @param query
   * @param options
   */
  protected async doGetMany(
    builder: SelectQueryBuilder<T>,
    query: ParsedRequestParams,
    options: CrudRequestOptions,
  ): Promise<GetManyDefaultResponse<T> | T[]> {
    if (this.decidePagination(query, options)) {
      const [data, total] = await builder.getManyAndCount();
      const limit = builder.expressionMap.take;
      const offset = builder.expressionMap.skip;

      return this.createPageInfo(data, total, limit || total, offset || 0);
    }

    return builder.getMany();
  }

  protected onInitMapEntityColumns() {
    this.entityColumns = this.repo.metadata.columns.map((prop) => {
      // In case column is an embedded, use the propertyPath to get complete path
      if (prop.embeddedMetadata) {
        this.entityColumnsHash[prop.propertyPath] = true;
        return prop.propertyPath;
      }
      this.entityColumnsHash[prop.propertyName] = true;
      return prop.propertyName;
    });
    this.entityPrimaryColumns = this.repo.metadata.columns
      .filter((prop) => prop.isPrimary)
      .map((prop) => prop.propertyName);
  }

  protected onInitMapRelations() {
    this.entityRelationsHash = this.repo.metadata.relations.reduce(
      (hash, curr) => ({
        ...hash,
        [curr.propertyName]: {
          name: curr.propertyName,
          columns: curr.inverseEntityMetadata.columns.map((col) => col.propertyPath),
          primaryColumns: curr.inverseEntityMetadata.primaryColumns.map(
            (col) => col.propertyPath,
          ),
        },
      }),
      {},
    );
  }

  protected async getOneOrFail(req: CrudRequest, shallow = false): Promise<T> {
    const { parsed, options } = req;
    const builder = shallow
      ? this.repo.createQueryBuilder(this.alias)
      : await this.createBuilder(parsed, options);

    if (shallow) {
      this.setSearchCondition(builder, parsed.search);
    }

    const found = await builder.getOne();

    if (!found) {
      this.throwNotFoundException(this.alias);
    }

    return found;
  }

  protected prepareEntityBeforeSave(
    dto: DeepPartial<T>,
    parsed: CrudRequest['parsed'],
  ): T {
    /* istanbul ignore if */
    if (!isObject(dto)) {
      return undefined;
    }

    if (hasLength(parsed.paramsFilter)) {
      for (const filter of parsed.paramsFilter) {
        dto[filter.field] = filter.value;
      }
    }

    /* istanbul ignore if */
    if (!hasLength(objKeys(dto))) {
      return undefined;
    }

    return dto instanceof this.entityType
      ? Object.assign(dto, parsed.authPersist)
      : plainToClass(this.entityType, { ...dto, ...parsed.authPersist });
  }

  protected getAllowedColumns(columns: string[], options: QueryOptions): string[] {
    return (!options.exclude || !options.exclude.length) &&
      (!options.allow || /* istanbul ignore next */ !options.allow.length)
      ? columns
      : columns.filter(
          (column) =>
            (options.exclude && options.exclude.length
              ? !options.exclude.some((col) => col === column)
              : /* istanbul ignore next */ true) &&
            (options.allow && options.allow.length
              ? options.allow.some((col) => col === column)
              : /* istanbul ignore next */ true),
        );
  }

  protected getRelationMetadata(field: string) {
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

  protected setJoin(
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
        columns: curr.inverseEntityMetadata.columns.map((col) => col.propertyName),
        primaryColumns: curr.inverseEntityMetadata.primaryColumns.map(
          (col) => col.propertyName,
        ),
        nestedRelation: curr.nestedRelation,
      };
    }

    /* istanbul ignore else */
    if (cond.field && this.entityRelationsHash[cond.field] && joinOptions[cond.field]) {
      const relation = this.entityRelationsHash[cond.field];
      const options = joinOptions[cond.field];
      const allowed = this.getAllowedColumns(relation.columns, options);

      /* istanbul ignore if */
      if (!allowed.length) {
        return true;
      }

      const alias = options.alias ? options.alias : relation.name;

      const columns =
        !cond.select || !cond.select.length
          ? allowed
          : cond.select.filter((col) => allowed.some((a) => a === col));

      const select = [
        ...relation.primaryColumns,
        ...(options.persist && options.persist.length ? options.persist : []),
        ...columns,
      ].map((col) => `${alias}.${col}`);

      const relationPath = relation.nestedRelation || `${this.alias}.${relation.name}`;
      const relationType = options.required ? 'innerJoin' : 'leftJoin';

      builder[relationType](relationPath, alias);
      builder.addSelect(select);
    }

    return true;
  }

  protected setAndWhere(
    cond: QueryFilter,
    i: any,
    builder: SelectQueryBuilder<T> | WhereExpression,
  ) {
    const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i}`);
    builder.andWhere(str, params);
  }

  protected setOrWhere(
    cond: QueryFilter,
    i: any,
    builder: SelectQueryBuilder<T> | WhereExpression,
  ) {
    const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i}`);
    builder.orWhere(str, params);
  }

  protected setSearchCondition(
    builder: SelectQueryBuilder<T>,
    search: SCondition,
    condition: SConditionKey = '$and',
  ) {
    /* istanbul ignore else */
    if (isObject(search)) {
      const keys = objKeys(search);
      /* istanbul ignore else */
      if (keys.length) {
        // search: {$and: [...], ...}
        if (isArrayFull(search.$and)) {
          // search: {$and: [{}]}
          if (search.$and.length === 1) {
            this.setSearchCondition(builder, search.$and[0], condition);
          }
          // search: {$and: [{}, {}, ...]}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb: any) => {
                search.$and.forEach((item: any) => {
                  this.setSearchCondition(qb, item, '$and');
                });
              }),
            );
          }
        }
        // search: {$or: [...], ...}
        else if (isArrayFull(search.$or)) {
          // search: {$or: [...]}
          if (keys.length === 1) {
            // search: {$or: [{}]}
            if (search.$or.length === 1) {
              this.setSearchCondition(builder, search.$or[0], condition);
            }
            // search: {$or: [{}, {}, ...]}
            else {
              this.builderAddBrackets(
                builder,
                condition,
                new Brackets((qb: any) => {
                  search.$or.forEach((item: any) => {
                    this.setSearchCondition(qb, item, '$or');
                  });
                }),
              );
            }
          }
          // search: {$or: [...], foo, ...}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb: any) => {
                keys.forEach((field: string) => {
                  if (field !== '$or') {
                    const value = search[field];
                    if (!isObject(value)) {
                      this.builderSetWhere(qb, '$and', field, value);
                    } else {
                      this.setSearchFieldObjectCondition(qb, '$and', field, value);
                    }
                  } else {
                    if (search.$or.length === 1) {
                      this.setSearchCondition(builder, search.$or[0], '$and');
                    } else {
                      this.builderAddBrackets(
                        qb,
                        '$and',
                        new Brackets((qb2: any) => {
                          search.$or.forEach((item: any) => {
                            this.setSearchCondition(qb2, item, '$or');
                          });
                        }),
                      );
                    }
                  }
                });
              }),
            );
          }
        }
        // search: {...}
        else {
          // search: {foo}
          if (keys.length === 1) {
            const field = keys[0];
            const value = search[field];
            if (!isObject(value)) {
              this.builderSetWhere(builder, condition, field, value);
            } else {
              this.setSearchFieldObjectCondition(builder, condition, field, value);
            }
          }
          // search: {foo, ...}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb: any) => {
                keys.forEach((field: string) => {
                  const value = search[field];
                  if (!isObject(value)) {
                    this.builderSetWhere(qb, '$and', field, value);
                  } else {
                    this.setSearchFieldObjectCondition(qb, '$and', field, value);
                  }
                });
              }),
            );
          }
        }
      }
    }
  }

  protected builderAddBrackets(
    builder: SelectQueryBuilder<T>,
    condition: SConditionKey,
    brackets: Brackets,
  ) {
    if (condition === '$and') {
      builder.andWhere(brackets);
    } else {
      builder.orWhere(brackets);
    }
  }

  protected builderSetWhere(
    builder: SelectQueryBuilder<T>,
    condition: SConditionKey,
    field: string,
    value: any,
    operator: ComparisonOperator = '$eq',
  ) {
    const time = process.hrtime();
    const index = `${field}${time[0]}${time[1]}`;
    const args = [
      { field, operator: isNull(value) ? '$isnull' : operator, value },
      index,
      builder,
    ];
    const fn = condition === '$and' ? this.setAndWhere : this.setOrWhere;
    fn.apply(this, args);
  }

  protected setSearchFieldObjectCondition(
    builder: SelectQueryBuilder<T>,
    condition: SConditionKey,
    field: string,
    object: any,
  ) {
    /* istanbul ignore else */
    if (isObject(object)) {
      const operators = objKeys(object);

      if (operators.length === 1) {
        const operator = operators[0] as ComparisonOperator;
        const value = object[operator];

        if (isObject(object.$or)) {
          const orKeys = objKeys(object.$or);
          this.setSearchFieldObjectCondition(
            builder,
            orKeys.length === 1 ? condition : '$or',
            field,
            object.$or,
          );
        } else {
          this.builderSetWhere(builder, condition, field, value, operator);
        }
      } else {
        /* istanbul ignore else */
        if (operators.length > 1) {
          this.builderAddBrackets(
            builder,
            condition,
            new Brackets((qb: any) => {
              operators.forEach((operator: ComparisonOperator) => {
                const value = object[operator];

                if (operator !== '$or') {
                  this.builderSetWhere(qb, condition, field, value, operator);
                } else {
                  const orKeys = objKeys(object.$or);

                  if (orKeys.length === 1) {
                    this.setSearchFieldObjectCondition(qb, condition, field, object.$or);
                  } else {
                    this.builderAddBrackets(
                      qb,
                      condition,
                      new Brackets((qb2: any) => {
                        this.setSearchFieldObjectCondition(qb2, '$or', field, object.$or);
                      }),
                    );
                  }
                }
              });
            }),
          );
        }
      }
    }
  }

  protected getSelect(query: ParsedRequestParams, options: QueryOptions): string[] {
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

  protected getSort(query: ParsedRequestParams, options: QueryOptions) {
    return query.sort && query.sort.length
      ? this.mapSort(query.sort)
      : options.sort && options.sort.length
      ? this.mapSort(options.sort)
      : {};
  }

  protected getFieldWithAlias(field: string) {
    const cols = field.split('.');
    // relation is alias
    switch (cols.length) {
      case 1:
        return `${this.alias}.${field}`;
      case 2:
        return field;
      default:
        return cols.slice(cols.length - 2, cols.length).join('.');
    }
  }

  protected mapSort(sort: QuerySort[]) {
    const params: ObjectLiteral = {};

    for (let i = 0; i < sort.length; i++) {
      params[this.getFieldWithAlias(sort[i].field)] = sort[i].order;
    }

    return params;
  }

  protected mapOperatorsToQuery(
    cond: QueryFilter,
    param: any,
  ): { str: string; params: ObjectLiteral } {
    const field = this.getFieldWithAlias(cond.field);
    const likeOperator =
      this.dbName === 'postgres' ? 'ILIKE' : /* istanbul ignore next */ 'LIKE';
    let str: string;
    let params: ObjectLiteral;

    if (cond.operator[0] !== '$') {
      cond.operator = ('$' + cond.operator) as ComparisonOperator;
    }

    switch (cond.operator) {
      case '$eq':
        str = `${field} = :${param}`;
        break;

      case '$ne':
        str = `${field} != :${param}`;
        break;

      case '$gt':
        str = `${field} > :${param}`;
        break;

      case '$lt':
        str = `${field} < :${param}`;
        break;

      case '$gte':
        str = `${field} >= :${param}`;
        break;

      case '$lte':
        str = `${field} <= :${param}`;
        break;

      case '$starts':
        str = `${field} LIKE :${param}`;
        params = { [param]: `${cond.value}%` };
        break;

      case '$ends':
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}` };
        break;

      case '$cont':
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$excl':
        str = `${field} NOT LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$in':
        this.checkFilterIsArray(cond);
        str = `${field} IN (:...${param})`;
        break;

      case '$notin':
        this.checkFilterIsArray(cond);
        str = `${field} NOT IN (:...${param})`;
        break;

      case '$isnull':
        str = `${field} IS NULL`;
        params = {};
        break;

      case '$notnull':
        str = `${field} IS NOT NULL`;
        params = {};
        break;

      case '$between':
        this.checkFilterIsArray(cond, cond.value.length !== 2);
        str = `${field} BETWEEN :${param}0 AND :${param}1`;
        params = {
          [`${param}0`]: cond.value[0],
          [`${param}1`]: cond.value[1],
        };
        break;

      // case insensitive
      case '$eqL':
        str = `LOWER(${field}) = :${param}`;
        break;

      case '$neL':
        str = `LOWER(${field}) != :${param}`;
        break;

      case '$startsL':
        str = `${field} ${likeOperator} :${param}`;
        params = { [param]: `${cond.value}%` };
        break;

      case '$endsL':
        str = `${field} ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}` };
        break;

      case '$contL':
        str = `${field} ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$exclL':
        str = `${field} NOT ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$inL':
        this.checkFilterIsArray(cond);
        str = `LOWER(${field}) IN (:...${param})`;
        break;

      case '$notinL':
        this.checkFilterIsArray(cond);
        str = `LOWER(${field}) NOT IN (:...${param})`;
        break;

      /* istanbul ignore next */
      default:
        str = `${field} = :${param}`;
        break;
    }

    if (typeof params === 'undefined') {
      params = { [param]: cond.value };
    }

    return { str, params };
  }

  private checkFilterIsArray(cond: QueryFilter, withLength?: boolean) {
    /* istanbul ignore if */
    if (
      !Array.isArray(cond.value) ||
      !cond.value.length ||
      (!isNil(withLength) ? withLength : false)
    ) {
      this.throwBadRequestException(`Invalid column '${cond.field}' value`);
    }
  }
}

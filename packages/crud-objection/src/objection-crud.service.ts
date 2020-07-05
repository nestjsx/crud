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
  ComparisonOperator,
  CondOperator,
  ParsedRequestParams,
  QueryFilter,
  QueryJoin,
  QuerySort,
  QuerySortOperator,
  SCondition,
  SConditionKey,
} from '@nestjsx/crud-request';
import {
  hasLength,
  isArrayFull,
  isNil,
  isObject,
  isUndefined,
  objKeys,
} from '@nestjsx/util';
import {
  Model,
  ModelClass,
  Raw,
  raw,
  Relation as ObjectionRelation,
  Transaction,
  transaction,
} from 'objection';
import { OnModuleInit } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { oO } from '@zmotivat0r/o0';

interface ModelRelation {
  name: string;
  path: string;
  objectionRelation: ObjectionRelation;
  tableName: string;
  columnProps: string[];
  referencedColumnProps: string[];
}

type DbmsType = 'pg' | 'mysql';

interface OperatorOptions {
  value: any;
  dbmsType: DbmsType;
}

interface NormalizedOperator {
  columnProp: string | Raw;
  operator: string;
  value?: any;
}

interface OperatorNormalizer {
  (columnProp: string, options?: OperatorOptions): NormalizedOperator;
}

const CHUNK_SIZE = 1000;
const OBJECTION_RELATION_SEPARATOR = ':';
const PATH_SEPARATOR = '.';

const OPERATORS: {
  [operator: string]: OperatorNormalizer;
} = {
  [CondOperator.EQUALS]: (columnProp, { value }) => {
    return { columnProp, operator: '=', value };
  },
  [CondOperator.NOT_EQUALS]: (columnProp, { value }) => {
    return { columnProp, operator: '!=', value };
  },
  [CondOperator.GREATER_THAN]: (columnProp, { value }) => {
    return { columnProp, operator: '>', value };
  },
  [CondOperator.LOWER_THAN]: (columnProp, { value }) => {
    return { columnProp, operator: '<', value };
  },
  [CondOperator.GREATER_THAN_EQUALS]: (columnProp, { value }) => {
    return { columnProp, operator: '>=', value };
  },
  [CondOperator.LOWER_THAN_EQUALS]: (columnProp, { value }) => {
    return { columnProp, operator: '<=', value };
  },
  [CondOperator.STARTS]: (columnProp, { value }) => {
    return {
      columnProp,
      operator: 'LIKE',
      value: `${value}%`,
    };
  },
  [CondOperator.ENDS]: (columnProp, { value }) => {
    return {
      columnProp,
      operator: 'LIKE',
      value: `%${value}`,
    };
  },
  [CondOperator.CONTAINS]: (columnProp, { value }) => {
    return {
      columnProp,
      operator: 'LIKE',
      value: `%${value}%`,
    };
  },
  [CondOperator.EXCLUDES]: (columnProp, { value }) => {
    return {
      columnProp,
      operator: `NOT LIKE`,
      value: `%${value}%`,
    };
  },
  [CondOperator.IN]: (columnProp, { value }) => {
    /* istanbul ignore if */
    if (!isArrayFull(value)) {
      throw new Error(`Invalid column '${columnProp}' value`);
    }
    return {
      columnProp,
      operator: 'IN',
      value,
    };
  },
  [CondOperator.NOT_IN]: (columnProp, { value }) => {
    /* istanbul ignore if */
    if (!isArrayFull(value)) {
      throw new Error(`Invalid column '${columnProp}' value`);
    }
    return {
      columnProp,
      operator: 'NOT IN',
      value,
    };
  },
  [CondOperator.IS_NULL]: (columnProp) => {
    return {
      columnProp,
      operator: 'IS NULL',
    };
  },
  [CondOperator.NOT_NULL]: (columnProp) => {
    return {
      columnProp,
      operator: 'IS NOT NULL',
    };
  },
  [CondOperator.BETWEEN]: (columnProp, { value }) => {
    /* istanbul ignore if */
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error(`Invalid column '${columnProp}' value`);
    }

    return {
      columnProp,
      operator: 'BETWEEN',
      value: [value[0], value[1]],
    };
  },
  // case insensitive
  [CondOperator.EQUALS_LOW]: (columnProp, { value }) => {
    return { columnProp: raw('LOWER(??)', [columnProp]), operator: '=', value };
  },
  [CondOperator.NOT_EQUALS_LOW]: (columnProp, { value }) => {
    return { columnProp: raw('LOWER(??)', [columnProp]), operator: '!=', value };
  },
  [CondOperator.STARTS_LOW]: (columnProp, { value, dbmsType }) => {
    return {
      columnProp: raw('LOWER(??)', [columnProp]),
      /* istanbul ignore next */
      operator: dbmsType === 'pg' ? 'ILIKE' : /* istanbul ignore next */ 'LIKE',
      value: `${value}%`,
    };
  },
  [CondOperator.ENDS_LOW]: (columnProp, { value, dbmsType }) => {
    return {
      columnProp: raw('LOWER(??)', [columnProp]),
      /* istanbul ignore next */
      operator: dbmsType === 'pg' ? 'ILIKE' : /* istanbul ignore next */ 'LIKE',
      value: `%${value}`,
    };
  },
  [CondOperator.CONTAINS_LOW]: (columnProp, { value, dbmsType }) => {
    return {
      columnProp: raw('LOWER(??)', [columnProp]),
      /* istanbul ignore next */
      operator: dbmsType === 'pg' ? 'ILIKE' : /* istanbul ignore next */ 'LIKE',
      value: `%${value}%`,
    };
  },
  [CondOperator.EXCLUDES_LOW]: (columnProp, { value, dbmsType }) => {
    return {
      columnProp: raw('LOWER(??)', [columnProp]),
      operator: `NOT ${dbmsType === 'pg' ? 'ILIKE' : /* istanbul ignore next */ 'LIKE'}`,
      value: `%${value}%`,
    };
  },
  [CondOperator.IN_LOW]: (columnProp, { value }) => {
    /* istanbul ignore if */
    if (!isArrayFull(value)) {
      throw new Error(`Invalid column '${columnProp}' value`);
    }
    return {
      columnProp: raw('LOWER(??)', [columnProp]),
      operator: 'IN',
      value,
    };
  },
  [CondOperator.NOT_IN_LOW]: (columnProp, { value }) => {
    /* istanbul ignore if */
    if (!isArrayFull(value)) {
      throw new Error(`Invalid column '${columnProp}' value`);
    }
    return {
      columnProp: raw('LOWER(??)', [columnProp]),
      operator: 'NOT IN',
      value,
    };
  },
};

export class ObjectionCrudService<T extends Model> extends CrudService<T>
  implements OnModuleInit {
  protected dbmsType: DbmsType;
  private modelColumnProps: string[];
  private modelColumnPropsSet: Set<string> = new Set();
  private modelIdColumnProps: string[];
  private modelRelations: { [relationName: string]: ModelRelation } = {};
  private notRecognizedModelRelations: Set<string> = new Set();
  protected sqlInjectionRegEx: RegExp[] = [
    /(%27)|(\')|(--)|(%23)|(#)/gi,
    /((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))/gi,
    /w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))/gi,
    /((%27)|(\'))union/gi,
  ];

  constructor(public readonly modelClass: ModelClass<T>) {
    super();
  }

  query(trx?: Transaction): T['QueryBuilderType'] {
    return this.modelClass.query(trx);
  }

  async onModuleInit() {
    await this.fetchTableMetadata(this.modelClass.tableName);
    await this.initModelRelations();
    await this.initModelColumnProps();
    this.dbmsType = this.modelClass.knex().client.config.client;
  }

  public async withTransaction<R>(
    callback: (innerTrx) => Promise<R>,
    trx?: Transaction,
  ): Promise<R> {
    return transaction(trx || this.modelClass.knex(), (innerTrx) => callback(innerTrx));
  }

  public async getOne(req: CrudRequest, trx?: Transaction): Promise<T> {
    return this.getOneOrFail(req, { trx });
  }

  public async getMany(
    req: CrudRequest,
    trx?: Transaction,
  ): Promise<GetManyDefaultResponse<T> | T[]> {
    const { parsed, options } = req;
    const { builder } = await this.createBuilder(parsed, options, { trx });

    const { offset, limit } = getOffsetLimit(parsed, options);
    if (Number.isFinite(offset) && Number.isFinite(limit)) {
      const { total, data } = await builder.then((data) =>
        builder.resultSize().then((total) => ({ total, data })),
      );
      /* istanbul ignore next */
      return this.createPageInfo(data, total, limit || total, offset || 0);
    }

    return builder as any;
  }

  public async createOne(
    req: CrudRequest,
    dto: Partial<T>,
    trx?: Transaction,
  ): Promise<T> {
    const { returnShallow } = req.options.routes.createOneBase;
    const model = this.prepareModelBeforeSave(dto, req.parsed);

    /* istanbul ignore if */
    if (!model) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    return (await this.withTransaction(async (innerTrx) => {
      const saved = await this.modelClass.query(innerTrx).insertGraph(model);

      if (returnShallow) {
        return saved;
      } else {
        const primaryParams = this.getPrimaryParams(req.options);

        /* istanbul ignore next */
        if (!primaryParams.length || primaryParams.some((p) => isNil(saved[p]))) {
          return saved;
        } else {
          req.parsed.search = primaryParams.reduce(
            (acc, p) => ({ ...acc, [p]: saved[p] }),
            {},
          );
          return this.getOneOrFail(req, { trx: innerTrx });
        }
      }
    }, trx)) as any;
  }

  public async createMany(
    req: CrudRequest,
    dto: CreateManyDto<Partial<T>>,
    trx?: Transaction,
  ): Promise<T[]> {
    /* istanbul ignore if */
    if (!isObject(dto) || !isArrayFull(dto.bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const bulk = dto.bulk
      .map((one) => this.prepareModelBeforeSave(one, req.parsed))
      .filter((d) => !isUndefined(d));

    /* istanbul ignore if */
    if (!hasLength(bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    return this.withTransaction(async (innerTrx) => {
      let result = [];

      const chunks = toChunks(bulk);
      for (const chunk of chunks) {
        result = result.concat(await this.modelClass.query(innerTrx).insertGraph(chunk));
      }

      return result;
    }, trx);
  }

  public async updateOne(
    req: CrudRequest,
    dto: Partial<T>,
    trx?: Transaction,
  ): Promise<T> {
    const { allowParamsOverride, returnShallow } = req.options.routes.updateOneBase;

    return (await this.withTransaction(async (innerTrx) => {
      const found = await this.getOneOrFail(req, {
        trx: innerTrx,
        shallow: returnShallow,
      });

      const paramsFilters = this.getParamFilters(req.parsed);
      if (allowParamsOverride) {
        Object.assign(found, dto, req.parsed.authPersist);
      } else {
        Object.assign(found, dto, paramsFilters, req.parsed.authPersist);
      }

      const updated = (await this.modelClass.query(innerTrx).upsertGraph(found, {
        noDelete: true,
        noInsert: true,
        noRelate: true,
        noUnrelate: true,
      })) as any;

      if (returnShallow) {
        return updated;
      } else {
        req.parsed.paramsFilter.forEach((filter) => {
          filter.value = updated[filter.field];
        });

        return this.getOneOrFail(req, { trx: innerTrx });
      }
    }, trx)) as any;
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

  public async replaceOne(
    req: CrudRequest,
    dto: Partial<T>,
    trx?: Transaction,
  ): Promise<T> {
    const { allowParamsOverride, returnShallow } = req.options.routes.replaceOneBase;

    return (await this.withTransaction(async (innerTrx) => {
      const [_, found = {}] = await oO(
        this.getOneOrFail(req, {
          trx: innerTrx,
          shallow: returnShallow,
        }),
      );

      const paramsFilters = this.getParamFilters(req.parsed);
      if (allowParamsOverride) {
        Object.assign(found, paramsFilters, dto, req.parsed.authPersist);
      } else {
        Object.assign(found, dto, paramsFilters, req.parsed.authPersist);
      }

      const replaced = await this.modelClass.query(innerTrx).upsertGraph(found, {
        noDelete: true,
        noUnrelate: true,
        insertMissing: true,
      });

      if (returnShallow) {
        return replaced;
      } else {
        const primaryParams = this.getPrimaryParams(req.options);

        /* istanbul ignore next */
        if (!primaryParams.length) {
          return replaced;
        }

        req.parsed.search = primaryParams.reduce(
          (acc, p) => ({ ...acc, [p]: replaced[p] }),
          {},
        );
        return this.getOneOrFail(req, { trx: innerTrx });
      }
    }, trx)) as any;
  }

  public async deleteOne(req: CrudRequest, trx?: Transaction): Promise<void | T> {
    const { returnDeleted } = req.options.routes.deleteOneBase;
    const found = await this.getOneOrFail(req, { trx, shallow: returnDeleted });
    await found.$query(trx).delete();
    return returnDeleted ? found : undefined;
  }

  private get tableName(): string {
    return this.modelClass.tableName;
  }

  private get idColumns(): string[] {
    return [].concat(this.modelClass.idColumn);
  }

  private columnToProp(column: string): string {
    return (Model as any).columnNameToPropertyName(column);
  }

  private async fetchTableMetadata(tableName: string) {
    return Model.fetchTableMetadata({ table: tableName });
  }

  private getObjectionRelations<C extends Model>(
    modelClass: ModelClass<C>,
  ): { [relationName: string]: ObjectionRelation } {
    return (modelClass as any).getRelations();
  }

  private async initModelRelations() {
    const objectionRelations: ObjectionRelation[] = Object.values(
      this.getObjectionRelations(this.modelClass),
    );

    await Promise.all(
      objectionRelations.map(async (relation) => {
        this.modelRelations[relation.name] = await this.toModelRelation(relation);
      }),
    );
  }

  private async initModelColumnProps() {
    this.modelColumnProps = (await this.fetchTableMetadata(
      this.modelClass.tableName,
    )).columns.map((column) => {
      const columnProp = this.columnToProp(column);
      this.modelColumnPropsSet.add(columnProp);
      return columnProp;
    });

    this.modelIdColumnProps = this.idColumns.map((column) => this.columnToProp(column));
  }

  private async getOneOrFail(
    req: CrudRequest,
    fetchOptions: { trx?: Transaction; shallow?: boolean },
  ): Promise<T> {
    const { parsed, options } = req;
    const { trx, shallow } = fetchOptions;

    const builder = shallow
      ? this.modelClass.query(trx).skipUndefined()
      : (await this.createBuilder(parsed, options, { trx })).builder;

    if (shallow) {
      this.setSearchCondition(builder, parsed.search);
    }

    const found = await builder.first();

    if (!found) {
      this.throwNotFoundException(this.tableName);
    }

    return found as any;
  }

  private prepareModelBeforeSave(
    dto: Partial<T>,
    parsed: CrudRequest['parsed'],
  ): Partial<T> {
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

    return { ...dto, ...parsed.authPersist };
  }

  private hasColumnProp(columnProp: string): boolean {
    return this.modelColumnPropsSet.has(columnProp);
  }

  private hasModelRelationColumnProp(relationPath: string, columnProp: string): boolean {
    return (
      this.hasModelRelation(relationPath) &&
      this.modelRelations[relationPath].columnProps.includes(columnProp)
    );
  }

  private async createBuilder(
    parsedReq: ParsedRequestParams,
    options: CrudRequestOptions,
    builderOptions: {
      many?: boolean;
      trx?: Transaction;
    },
  ) {
    const { many, trx } = { many: true, ...builderOptions };

    const builder = this.modelClass.query(trx).skipUndefined();
    const select = this.getSelect(parsedReq, options.query);
    builder.select(select);

    const joinAliases = objKeys(options.query.join || {}).reduce(
      (acc, joinField: string) => {
        if (options.query.join[joinField].alias) {
          acc[options.query.join[joinField].alias] = joinField;
        }
        return acc;
      },
      {},
    );

    this.setSearchCondition(builder, parsedReq.search, '$and', joinAliases);

    const joinOptions = options.query.join || {};
    const allowedJoins = objKeys(joinOptions);

    if (hasLength(allowedJoins)) {
      const eagerJoins = new Set<string>();

      for (const allowedJoin of allowedJoins) {
        if (joinOptions[allowedJoin].eager) {
          const cond = parsedReq.join.find(
            (join) => join && join.field === allowedJoin,
          ) || {
            field: allowedJoin,
          };

          await this.setJoin(cond, joinOptions, builder);
          eagerJoins.add(allowedJoin);
        }
      }

      if (isArrayFull(parsedReq.join)) {
        for (const join of parsedReq.join) {
          if (!eagerJoins.has(join.field)) {
            await this.setJoin(join, joinOptions, builder);
          }
        }
      }
    }

    /* istanbul ignore else */
    if (many) {
      const sort = this.getSort(parsedReq, options.query);
      sort.forEach(({ columnProp, order }) => builder.orderBy(columnProp, order));

      const { offset, limit } = getOffsetLimit(parsedReq, options);
      if (Number.isFinite(limit)) {
        builder.limit(limit);
      }

      if (Number.isFinite(offset)) {
        builder.offset(offset);
      }
    }

    if (options.query.cache && parsedReq.cache !== 0) {
      // TODO: Find a workaround to implement caching for ObjectionCrudService
      console.warn(`Objection.js doesn't support query caching`);
    }

    return {
      builder,
    };
  }

  protected setSearchCondition(
    builder: T['QueryBuilderType'],
    search: SCondition,
    condition: SConditionKey = '$and',
    joinAliases: object = {},
  ) {
    /* istanbul ignore else */
    if (!isObject(search)) {
      return;
    }

    const searchProps = objKeys(search);
    if (!searchProps.length) {
      return;
    }

    /* istanbul ignore else */
    // search: {$and: [...], ...}
    if (isArrayFull(search.$and)) {
      if (search.$and.length === 1) {
        // search: {$and: [{}]}
        this.setSearchCondition(builder, search.$and[0], condition, joinAliases);
      } else {
        // search: {$and: [{}, {}, ...]}
        this.builderAddBrackets(builder, condition, (qb: T['QueryBuilderType']) => {
          search.$and.forEach((item: SCondition) => {
            this.setSearchCondition(qb, item, '$and', joinAliases);
          });
        });
      }
      return;
    }

    if (isArrayFull(search.$or)) {
      // search: {$or: [...], ...}
      if (searchProps.length === 1) {
        // search: {$or: [...]}
        if (search.$or.length === 1) {
          // search: {$or: [{}]}
          this.setSearchCondition(builder, search.$or[0], condition, joinAliases);
        } else {
          // search: {$or: [{}, {}, ...]}
          this.builderAddBrackets(builder, condition, (qb: T['QueryBuilderType']) => {
            search.$or.forEach((item: SCondition) => {
              this.setSearchCondition(qb, item, '$or', joinAliases);
            });
          });
        }
      } else {
        // search: {$or: [...], foo, ...}
        this.builderAddBrackets(builder, condition, (qb: T['QueryBuilderType']) => {
          searchProps.forEach((field: string) => {
            if (field !== '$or') {
              const value = search[field];
              if (!isObject(value)) {
                this.setAndWhere(
                  { field, value, operator: CondOperator.EQUALS },
                  qb,
                  joinAliases,
                );
              } else {
                this.setSearchFieldObjectCondition(qb, '$and', field, value, joinAliases);
              }
            } else {
              if (search.$or.length === 1) {
                this.setSearchCondition(qb, search.$or[0], '$and', joinAliases);
              } else {
                this.builderAddBrackets(qb, '$and', (qb2: T['QueryBuilderType']) => {
                  search.$or.forEach((item: SCondition) => {
                    this.setSearchCondition(qb2, item, '$or', joinAliases);
                  });
                });
              }
            }
          });
        });
      }

      return;
    }

    // search: {...}
    if (searchProps.length === 1) {
      // search: {foo}
      const field = searchProps[0];
      const value = search[field];
      if (!isObject(value)) {
        this.builderSetWhere(
          builder,
          { field, operator: CondOperator.EQUALS, value },
          condition,
          joinAliases,
        );
      } else {
        this.setSearchFieldObjectCondition(builder, condition, field, value, joinAliases);
      }
      return;
    }

    // search: {foo, ...}
    this.builderAddBrackets(builder, condition, (qb: T['QueryBuilderType']) => {
      searchProps.forEach((field: string) => {
        const value = search[field];
        if (!isObject(value)) {
          this.builderSetWhere(
            qb,
            { field, operator: CondOperator.EQUALS, value },
            condition,
            joinAliases,
          );
        } else {
          this.setSearchFieldObjectCondition(qb, '$and', field, value, joinAliases);
        }
      });
    });
  }

  protected setSearchFieldObjectCondition(
    builder: T['QueryBuilderType'],
    condition: SConditionKey,
    field: string,
    obj: any,
    joinAliases: object,
  ) {
    /* istanbul ignore if */
    if (!isObject(obj)) {
      return;
    }

    const operators = objKeys(obj);
    if (operators.length === 1) {
      if (isObject(obj.$or)) {
        const orKeys = objKeys(obj.$or);
        this.setSearchFieldObjectCondition(
          builder,
          orKeys.length === 1 ? condition : '$or',
          field,
          obj.$or,
          joinAliases,
        );
      } else {
        const operator = operators[0] as ComparisonOperator;
        const value = obj[operator];
        this.builderSetWhere(builder, { field, operator, value }, condition, joinAliases);
      }
      return;
    }

    this.builderAddBrackets(builder, condition, (qb: T['QueryBuilderType']) => {
      operators.forEach((operator: ComparisonOperator) => {
        const value = obj[operator];
        if (operator !== '$or') {
          this.builderSetWhere(qb, { field, operator, value }, condition, joinAliases);
          return;
        }

        const orKeys = objKeys(obj.$or);
        if (orKeys.length === 1) {
          this.setSearchFieldObjectCondition(qb, condition, field, obj.$or, joinAliases);
        } else {
          this.builderAddBrackets(qb, condition, (qb2: T['QueryBuilderType']) => {
            this.setSearchFieldObjectCondition(qb2, '$or', field, obj.$or, joinAliases);
          });
        }
      });
    });
  }

  private builderAddBrackets(
    builder: T['QueryBuilderType'],
    condition: SConditionKey,
    brackets: (qb: T['QueryBuilderType']) => void,
  ) {
    if (condition === '$and') {
      builder.andWhere(brackets);
    } else {
      builder.orWhere(brackets);
    }
  }

  private builderSetWhere(
    builder: T['QueryBuilderType'],
    filter: QueryFilter,
    condition: SConditionKey,
    joinAliases: object,
  ) {
    if (condition === '$and') {
      this.setAndWhere(filter, builder, joinAliases);
    } else {
      this.setOrWhere(filter, builder, joinAliases);
    }
  }

  private setAndWhere(
    cond: QueryFilter,
    builder: T['QueryBuilderType'],
    /* istanbul ignore next */
    joinAliases: object = {},
  ) {
    this.validateHasColumnProp(cond.field, joinAliases);
    const { columnProp, operator, value } = this.mapOperatorsToQuery(cond);

    if (operator === 'IS NULL') {
      builder.whereNull(columnProp);
    } else if (operator === 'IS NOT NULL') {
      builder.whereNotNull(columnProp);
    } else {
      builder.andWhere(columnProp, operator, value);
    }
  }

  private setOrWhere(
    cond: QueryFilter,
    builder: T['QueryBuilderType'],
    /* istanbul ignore next */
    joinAliases: object = {},
  ) {
    this.validateHasColumnProp(cond.field, joinAliases);
    const { columnProp, operator, value } = this.mapOperatorsToQuery(cond);

    /* istanbul ignore else */
    if (operator === 'IS NULL') {
      builder.orWhereNull(columnProp);
    } else if (operator === 'IS NOT NULL') {
      builder.orWhereNotNull(columnProp);
    } else {
      builder.orWhere(columnProp, operator, value);
    }
  }

  private getSelect(query: ParsedRequestParams, options: QueryOptions): string[] {
    const allowed = this.getAllowedColumnProps(this.modelColumnProps, options);

    const columnProps = isArrayFull(query.fields)
      ? query.fields.filter((field) => allowed.includes(field))
      : allowed;

    return unique(
      [
        ...(isArrayFull(options.persist) ? options.persist : []),
        ...columnProps,
        ...this.modelIdColumnProps,
      ].map((columnProp) => this.getColumnPropWithAlias(columnProp)),
    );
  }

  private getAllowedColumnProps(columnProps: string[], options: QueryOptions): string[] {
    if (!isArrayFull(options.exclude) && !isArrayFull(options.allow)) {
      return columnProps;
    }

    return columnProps.filter((columnProp) => {
      if (isArrayFull(options.exclude) && options.exclude.includes(columnProp)) {
        return false;
      }

      return isArrayFull(options.allow) ? options.allow.includes(columnProp) : true;
    });
  }

  private getSort(query: ParsedRequestParams, options: QueryOptions) {
    if (isArrayFull(query.sort)) {
      return this.mapSort(query.sort);
    }

    if (isArrayFull(options.sort)) {
      return this.mapSort(options.sort);
    }

    return [];
  }

  private mapSort(sort: QuerySort[]): { columnProp: string; order: QuerySortOperator }[] {
    return sort.map(({ field, order }) => {
      this.validateHasColumnProp(field);
      const checkedFiled = this.checkSqlInjection(this.getColumnPropWithAlias(field));
      return {
        columnProp: checkedFiled,
        order,
      };
    });
  }

  private getColumnPropWithAlias(columnPropPath: string) {
    const { relations, columnProp } = splitPath(columnPropPath);
    if (!isPath(columnPropPath)) {
      return `${this.tableName}.${columnPropPath}`;
    }

    if (relations.length === 1) {
      return columnPropPath;
    }

    return `${relations.join(OBJECTION_RELATION_SEPARATOR)}.${columnProp}`;
  }

  private mapOperatorsToQuery(cond: QueryFilter): NormalizedOperator {
    try {
      const normalizedColumn = this.getColumnPropWithAlias(cond.field);

      if (cond.operator[0] !== '$') {
        cond.operator = `$${cond.operator}` as ComparisonOperator;
      }

      return (OPERATORS[cond.operator] ||
        /* istanbul ignore next */ OPERATORS[CondOperator.EQUALS])(normalizedColumn, {
        value: cond.value,
        dbmsType: this.dbmsType,
      });
    } catch (e) {
      /* istanbul ignore next */
      this.throwBadRequestException(e.message);
    }
  }

  private validateHasColumnProp(path: string, joinAliases: object = {}) {
    if (isPath(path)) {
      const { relations, columnProp } = splitPath(path);

      let relationsPath = relations.join(PATH_SEPARATOR);
      relationsPath = joinAliases[relationsPath] || relationsPath;

      if (!this.hasModelRelation(relationsPath)) {
        this.throwBadRequestException(`Invalid relation name '${relationsPath}'`);
      }

      if (!this.hasModelRelationColumnProp(relationsPath, columnProp)) {
        this.throwBadRequestException(
          `Invalid column name '${columnProp}' for relation '${relationsPath}'`,
        );
      }
    } else {
      if (!this.hasColumnProp(path)) {
        this.throwBadRequestException(`Invalid column name '${path}'`);
      }
    }
  }

  private hasModelRelation(relationPath: string): boolean {
    return !!this.modelRelations[relationPath];
  }

  private async toModelRelation(
    objectionRelation: ObjectionRelation,
    overrides: Partial<ModelRelation> = {},
  ): Promise<ModelRelation> {
    const relationTableMeta = await this.fetchTableMetadata(
      objectionRelation.relatedModelClass.tableName,
    );
    return {
      name: objectionRelation.name,
      path: objectionRelation.name,
      objectionRelation,
      tableName: objectionRelation.relatedModelClass.tableName,
      columnProps: relationTableMeta.columns.map((col) => this.columnToProp(col)),
      referencedColumnProps: objectionRelation.relatedProp.props,
      ...overrides,
    };
  }

  private getObjectionRelationByPath(relationPath: string): ObjectionRelation {
    const { relations: parentRelationNames, columnProp: targetRelationName } = splitPath(
      relationPath,
    );

    const parentRelationPath = parentRelationNames.join(PATH_SEPARATOR);
    const parentRelation = this.modelRelations[parentRelationPath];

    /* istanbul ignore if */
    if (!parentRelation) {
      return null;
    }

    const parentObjectionRelations = this.getObjectionRelations(
      parentRelation.objectionRelation.ownerModelClass,
    );

    const targetObjectionRelation = parentObjectionRelations[targetRelationName];
    if (!targetObjectionRelation) {
      return null;
    }

    return targetObjectionRelation;
  }

  private async setJoin(
    cond: QueryJoin,
    joinOptions: JoinOptions,
    builder: T['QueryBuilderType'],
  ) {
    if (!this.notRecognizedModelRelations.has(cond.field) && isPath(cond.field)) {
      const objectionRelation = this.getObjectionRelationByPath(cond.field);
      if (!objectionRelation) {
        this.notRecognizedModelRelations.add(cond.field);
        return;
      }

      this.modelRelations[cond.field] = await this.toModelRelation(objectionRelation, {
        path: cond.field,
      });
    }

    /* istanbul ignore else */
    if (cond.field && this.hasModelRelation(cond.field) && joinOptions[cond.field]) {
      const relation = this.modelRelations[cond.field];
      const options = joinOptions[cond.field];
      const allowedColumnProps = this.getAllowedColumnProps(
        relation.columnProps,
        options,
      );

      /* istanbul ignore if */
      if (!allowedColumnProps.length) {
        return;
      }

      const columnProps = isArrayFull(cond.select)
        ? cond.select.filter((col) => allowedColumnProps.includes(col))
        : allowedColumnProps;

      // There is no point of using fetch and having "select === false"
      /* istanbul ignore next */
      if (options.select !== false && options.fetch) {
        // To filter fetched queries it's better to use Objection's filters
        // https://vincit.github.io/objection.js/api/query-builder/eager-methods.html#withgraphjoined
        builder.withGraphFetched(relation.path);
      } else {
        builder.withGraphJoined(
          options.alias ? `${relation.path} as ${options.alias}` : relation.path,
          {
            joinOperation: options.required ? 'innerJoin' : 'leftJoin',
          },
        );
      }

      if (options.select === false) {
        return;
      }

      const select = unique([
        ...relation.referencedColumnProps,
        ...(isArrayFull(options.persist) ? options.persist : []),
        ...columnProps,
      ]).map((columnProp) => `${relation.tableName}${PATH_SEPARATOR}${columnProp}`);

      builder.modifyGraph(relation.path, (qb) => qb.select(select));
    }
  }

  private checkSqlInjection(field: string): string {
    for (const regex of this.sqlInjectionRegEx) {
      /* istanbul ignore next */
      if (regex.test(field)) {
        this.throwBadRequestException(`SQL injection detected: "${field}"`);
      }
    }
    return field;
  }
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function splitPath(path: string): { relations: string[]; columnProp: string } {
  const items = path.split(PATH_SEPARATOR);
  return {
    relations: items.slice(0, items.length - 1),
    columnProp: items[items.length - 1],
  };
}

function isPath(path: string) {
  return path.includes(PATH_SEPARATOR);
}

function toChunks<T>(items: T[], size = CHUNK_SIZE): T[][] {
  /* istanbul ignore next */
  if (items.length < size) {
    return [items];
  }

  /* istanbul ignore next */
  const chunks = [];
  /* istanbul ignore next */
  let currentChunk = [];

  /* istanbul ignore next */
  items.forEach((item) => {
    /* istanbul ignore next */
    if (currentChunk.length > size) {
      currentChunk = [];
      chunks.push(currentChunk);
    }

    currentChunk.push(item);
  });

  /* istanbul ignore next */
  if (currentChunk.length) {
    chunks.push(currentChunk);
  }

  /* istanbul ignore next */
  return chunks;
}

function getOffsetLimit(
  req: ParsedRequestParams,
  options: CrudRequestOptions,
): { offset: number; limit: number } {
  if (options.query.alwaysPaginate) {
    if (req.page === undefined) {
      req.page = 1;
    }
    if (!req.limit && !options.query.limit) {
      options.query.limit = 10;
    }
  }

  const limit = getLimit(req, options.query);
  const offset = getOffset(req, limit);

  return {
    limit,
    offset,
  };
}

function getOffset(query: ParsedRequestParams, limit: number): number | null {
  if (query.page && limit) {
    return limit * (query.page - 1);
  }

  if (query.offset) {
    return query.offset;
  }

  return null;
}

function getLimit(query: ParsedRequestParams, options: QueryOptions): number | null {
  if (query.limit) {
    if (options.maxLimit) {
      if (query.limit <= options.maxLimit) {
        return query.limit;
      }
      return options.maxLimit;
    }

    return query.limit;
  }

  /* istanbul ignore if */
  if (options.limit) {
    if (options.maxLimit) {
      if (options.limit <= options.maxLimit) {
        return options.limit;
      }
      return options.maxLimit;
    }

    return options.limit;
  }

  return options.maxLimit ? options.maxLimit : null;
}

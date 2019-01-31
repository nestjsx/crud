import { isObject } from '@nestjs/common/utils/shared.utils';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import * as mongoose from 'mongoose';
import { RestfulService } from '../classes/restful-service.class';
import {
  RestfulOptions,
  JoinOptions,
  RequestParamsParsed,
  FilterParamParsed,
  JoinParamParsed,
} from '../interfaces';
import { ObjectLiteral } from '../interfaces/object-literal.interface';
import { isArrayFull, toObjectId } from '../utils';

export class RepositoryService<T> extends RestfulService<T> {
  protected options: RestfulOptions = {};

  private entityColumns: string[];
  private entityColumnsHash: ObjectLiteral = {};
  private entityRelationsHash: ObjectLiteral = {};

  constructor(protected repo: any, protected type: any) {
    super();

    this.onInitMapEntityColumns();
    this.onInitMapRelations();
  }

  private get entityType(): ClassType<T> {
    return this.repo.target as ClassType<T>;
  }

  private get alias(): string {
    return this.type.name;
  }

  /**
   * Get many entities
   * @param query
   * @param options
   */
  public async getMany(
    query: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ): Promise<T[]> {
    const mongooseQuery: any = await this.buildQuery(query, options);
    return this.repo
    .find(mongooseQuery.find)
    .select(mongooseQuery.select);;
  }

  /**
   * Get one entity by id
   * @param id
   * @param param1
   * @param options
   */
  public async getOne(
    id: string,
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

  /**
   * Create one entity
   * @param data
   * @param paramsFilter
   */
  public async createOne(data: any, paramsFilter: FilterParamParsed[] = []): Promise<T> {
    const entity = this.plainToClass(data, paramsFilter);

    if (!entity) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }


    return new this.repo(entity).save();
  }

  /**
   * Create many
   * @param data
   * @param paramsFilter
   */
  public async createMany(
    data: { bulk: any[] },
    paramsFilter: FilterParamParsed[] = [],
  ): Promise<T[]> {
    if (!data || !data.bulk || !data.bulk.length) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const bulk = data.bulk
      .map((one) => this.plainToClass(one, paramsFilter))
      .filter((d) => isObject(d));

    if (!bulk.length) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    return this.repo.save(bulk, { chunk: 50 });
  }

  /**
   * Update one entity
   * @param id
   * @param data
   * @param paramsFilter
   */
  public async updateOne(
    id: string,
    data: any,
    paramsFilter: FilterParamParsed[] = [],
  ): Promise<T> {
    // we need this, because TypeOrm will try to insert if no data found by id
    const item: any = await this.getOneOrFail({
      filter: [{ field: 'id', operator: 'eq', value: id }, ...paramsFilter],
    });
    if (data.$push) {
      Object.keys( data.$push )
      .map((key) => {
          if(!item[key]) {
              item[key] = [];
          }
          item[key].push(data.$push[key]);
      });
    }
    const entity = this.plainToClass(data, paramsFilter);
    Object.assign(item, entity);
    // we use save and not update because
    // we might want to update relational entities
    return item.save();
  }

  /**
   * Delete one entity
   * @param id
   * @param paramsFilter
   */
  public async deleteOne(id: string, paramsFilter: FilterParamParsed[] = []): Promise<void> {
    const found = await this.getOneOrFail({
      filter: [{ field: 'id', operator: 'eq', value: id }, ...paramsFilter],
    });

    const deleted = await this.repo.remove(found);
  }

  private async getOneOrFail(
    { filter, fields, join, cache }: RequestParamsParsed = {},
    options: RestfulOptions = {},
  ): Promise<T> {
    const queryMongoose: any = await this.buildQuery({ filter, fields, join, cache }, options, false);
    const found = await this.repo.findOne(queryMongoose.find)
    .select(queryMongoose.select);
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
  ): Promise<any> {

    // merge options
    const mergedOptions = Object.assign({}, this.options, options);
    // get selet fields
    const select = this.getSelect(query, mergedOptions);
    // create query builder
    const model: any = this.repo;
    let find: any = {};
    let limit: number;
    let skip: number;
    let sort: any;
    // select fields

    const hasFilter = isArrayFull(query.filter);
    const hasOr = isArrayFull(query.or);
    if (hasFilter) {
      find = query.filter
      .map(( field ) => this.setFindField(field))
      .reduce((prev, curr) => new Object({...prev, ...curr}), find);
      console.log('find', find);
    }
    if ( hasOr ) {
      console.error('"Or" is not supported');
    }

    if (many) {
      // set sort (order by)
      sort = this.getSort(query, mergedOptions);
      // model.orderBy(sort);
      // set take
      limit = this.getTake(query, mergedOptions);
      // set skip
      skip = this.getSkip(query, limit);
    }

    return {
      select,
      find,
      limit,
      sort,
    };
  }

  private plainToClass(data: any, paramsFilter: FilterParamParsed[] = []): T {
    if (!isObject(data)) {
      return undefined;
    }

    if (paramsFilter.length) {
      for (let filter of paramsFilter) {
        data[filter.field] = filter.value;
      }
    }

    if (!Object.keys(data).length) {
      return undefined;
    }

    return plainToClass(this.entityType, data);
  }

  private onInitMapEntityColumns() {
    this.entityColumns = this.type.columns.map((prop) => {
      this.entityColumnsHash[prop.propertyName] = true;
      return prop.propertyName;
    });
  }

  private onInitMapRelations() {
    console.log(this.type);
  }

  private hasColumn(column: string): boolean {
    return this.entityColumnsHash[column];
  }

  private validateHasColumn(column: string) {
    if (!this.hasColumn(column.split('.')[0])) {
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

  private setFindField(cond: FilterParamParsed) {
    this.validateHasColumn(cond.field);
    const obj = this.mapOperatorsToQuery(cond, cond.value);
    return obj;
  }

  private getSelect(query: RequestParamsParsed, options: RestfulOptions): object[] {
    const allowed = this.getAllowedColumns(this.entityColumns, options);
    console.log(allowed);
    const columns =
      query.fields && query.fields.length
        ? query.fields.filter((field) => allowed.some((col) => field === col))
        : allowed;

    const select = [
      ...(options.persist && options.persist.length ? options.persist : []),
      ...columns,
      'id', // always persist ids
    ].map((col) => new Object({[col as string]: true}))
    .reduce((prev: any, curr: any) => Object.assign(prev, curr), {});

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
  ) {
    const field = cond.field;
    let obj: any = {};
    if (field === 'id') {
      return {_id: toObjectId(param)};
    }
    switch (cond.operator) {
      case 'eq':
        obj = ({[field]: {$eq: param}});
        break;

      case 'ne':
        obj = ({[field]: {$ne: param}});
        break;

      case 'gt':
        obj = ({[field]: {$eq: param}});
        break;

      case 'lt':
        obj = ({[field]: {$eq: param}});
        break;

      case 'gte':
        obj = ({[field]: {$eq: param}});
        break;

      case 'lte':
        obj = ({[field]: {$eq: param}});
        break;

      case 'starts':
        obj = ({[field]: {$regex : '^' + param}});
        break;

      case 'ends':
        obj = ({[field]: {$regex : param + '&'}});
        break;

      case 'cont':
        obj = ({[field]: { $text: { $search: param } }});
        break;

      case 'excl':
        obj = ({[field]: { $text: { $search: '-' + param + '' } }});
        break;

      case 'in':
        obj = ({[field]: { $in: [param] }});
        break;

      case 'notin':
        obj = ({[field]: { $in: [param] }});
        break;

      case 'isnull':
        obj = ({[field]: null});
        break;

      case 'notnull':
        obj = ({[field]: { $exists: false }});
        break;

      case 'between':
        this.throwBadRequestException(`Is not supported`);
        break;

      default:
        obj = ({[field]: param});
        break;
    }

    return obj;
  }
}

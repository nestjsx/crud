import {
  hasLength,
  hasValue,
  isObject,
  isString,
  isArrayFull,
  isNil,
} from '@nestjsx/util';

import { RequestQueryBuilderOptions, CreateQueryParams } from './interfaces';
import {
  validateCondition,
  validateFields,
  validateJoin,
  validateNumeric,
  validateSort,
} from './request-query.validator';
import { QueryFields, QueryFilter, QueryJoin, QuerySort } from './types';

// tslint:disable:variable-name ban-types
export class RequestQueryBuilder {
  private static _options: RequestQueryBuilderOptions = {
    delim: '||',
    delimStr: ',',
    paramNamesMap: {
      fields: ['fields', 'select'],
      filter: 'filter',
      or: 'or',
      join: 'join',
      sort: 'sort',
      limit: ['per_page', 'limit'],
      offset: 'offset',
      page: 'page',
      cache: 'cache',
    },
  };

  private _fields: QueryFields = [];
  private _filter: QueryFilter[] = [];
  private _or: QueryFilter[] = [];
  private _join: QueryJoin[] = [];
  private _sort: QuerySort[] = [];
  private _limit: number;
  private _offset: number;
  private _page: number;
  private _cache: number;

  public queryString: string;

  static setOptions(options: RequestQueryBuilderOptions) {
    RequestQueryBuilder._options = {
      ...RequestQueryBuilder._options,
      ...options,
      paramNamesMap: {
        ...RequestQueryBuilder._options.paramNamesMap,
        ...(options.paramNamesMap ? options.paramNamesMap : {}),
      },
    };
  }

  static getOptions(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  static create(params?: CreateQueryParams, customOperators = {}): RequestQueryBuilder {
    const qb = new RequestQueryBuilder();
    return isObject(params) ? qb.createFromParams(params, customOperators) : qb;
  }

  get options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  query(): string {
    this.queryString = (
      this.getJoin() +
      this.getCondition('filter') +
      this.getCondition('or') +
      this.getFields() +
      this.getSort() +
      this.getNumeric('limit') +
      this.getNumeric('offset') +
      this.getNumeric('page') +
      this.getNumeric('cache')
    ).slice(0, -1);
    return this.queryString;
  }

  select(fields: QueryFields): this {
    validateFields(fields);
    this._fields = fields;
    return this;
  }

  setFilter(filter: QueryFilter, customOperators = {}): this {
    validateCondition(filter, 'filter', customOperators);
    this._filter.push(filter);
    return this;
  }

  setOr(or: QueryFilter, customOperators = {}): this {
    validateCondition(or, 'or', customOperators);
    this._or.push(or);
    return this;
  }

  setJoin(join: QueryJoin): this {
    validateJoin(join);
    this._join.push(join);
    return this;
  }

  sortBy(sort: QuerySort): this {
    validateSort(sort);
    this._sort.push(sort);
    return this;
  }

  setLimit(limit: number): this {
    validateNumeric(limit, 'limit');
    this._limit = limit;
    return this;
  }

  setOffset(offset: number): this {
    validateNumeric(offset, 'offset');
    this._offset = offset;
    return this;
  }

  setPage(page: number): this {
    validateNumeric(page, 'page');
    this._page = page;
    return this;
  }

  resetCache(): this {
    this._cache = 0;
    return this;
  }

  private createFromParams(params: CreateQueryParams, customOperators?: any): this {
    /* istanbul ignore else */
    if (isArrayFull(params.fields)) {
      this.select(params.fields);
    }
    /* istanbul ignore else */
    if (isArrayFull(params.filter)) {
      params.filter.forEach((filter) => this.setFilter(filter, customOperators));
    }
    /* istanbul ignore else */
    if (isArrayFull(params.or)) {
      params.or.forEach((or) => this.setOr(or, customOperators));
    }
    /* istanbul ignore else */
    if (isArrayFull(params.join)) {
      params.join.forEach((join) => this.setJoin(join));
    }
    /* istanbul ignore else */
    if (isArrayFull(params.sort)) {
      params.sort.forEach((sort) => this.sortBy(sort));
    }
    /* istanbul ignore else */
    if (!isNil(params.limit)) {
      this.setLimit(params.limit);
    }
    /* istanbul ignore else */
    if (!isNil(params.offset)) {
      this.setOffset(params.offset);
    }
    /* istanbul ignore else */
    if (!isNil(params.page)) {
      this.setPage(params.page);
    }
    /* istanbul ignore else */
    if (params.resetCache) {
      this.resetCache();
    }

    return this;
  }

  private getParamName(param: keyof RequestQueryBuilderOptions['paramNamesMap']): string {
    const name = this.options.paramNamesMap[param];
    return isString(name) ? (name as string) : (name[0] as string);
  }

  private getFields(): string {
    if (!hasLength(this._fields)) {
      return '';
    }

    const param = this.getParamName('fields');
    const value = this._fields.join(this.options.delimStr);

    return `${param}=${value}&`;
  }

  private getCondition(cond: 'filter' | 'or'): string {
    if (!hasLength(this[`_${cond}`])) {
      return '';
    }

    const param = this.getParamName(cond);
    const d = this.options.delim;
    const br = this.addBrackets(this[`_${cond}`]);

    return (
      this[`_${cond}`]
        .map(
          (f: QueryFilter) =>
            `${param}${br}=${f.field}${d}${f.operator}${
              hasValue(f.value) ? d + f.value : ''
            }`,
        )
        .join('&') + '&'
    );
  }

  private getJoin(): string {
    if (!hasLength(this._join)) {
      return '';
    }

    const param = this.getParamName('join');
    const d = this.options.delim;
    const ds = this.options.delimStr;
    const br = this.addBrackets(this._join);

    return (
      this._join
        .map(
          (j: QueryJoin) =>
            `${param}${br}=${j.field}${
              isArrayFull(j.select) ? d + j.select.join(ds) : ''
            }`,
        )
        .join('&') + '&'
    );
  }

  private getSort(): string {
    if (!hasLength(this._sort)) {
      return '';
    }

    const param = this.getParamName('sort');
    const ds = this.options.delimStr;
    const br = this.addBrackets(this._sort);

    return (
      this._sort
        .map((s: QuerySort) => `${param}${br}=${s.field}${ds}${s.order}`)
        .join('&') + '&'
    );
  }

  private getNumeric(num: 'limit' | 'offset' | 'page' | 'cache'): string {
    if (isNil(this[`_${num}`])) {
      return '';
    }

    const param = this.getParamName(num);
    const value = this[`_${num}`];

    return `${param}=${value}&`;
  }

  private addBrackets(arr: any[]): string {
    return arr.length > 1 ? '[]' : '';
  }
}

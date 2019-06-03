import { isNil, isArrayFull, hasLength } from '@nestjsx/util';

import {
  validateFields,
  validateCondition,
  validateJoin,
  validateSort,
  validateNumeric,
} from './request-query.validator';
import { RequestQueryBuilderOptions } from './interfaces';
import { QueryFields, QueryFilter, QueryJoin, QuerySort } from './types';

export class RequestQueryBuilder {
  private static _options: RequestQueryBuilderOptions = {
    delim: '||',
    delimStr: ',',
    paramNamesMap: {
      fields: ['fields', 'select'],
      filter: ['filter[]', 'filter'],
      or: ['or[]', 'or'],
      join: ['join[]', 'join'],
      sort: ['sort[]', 'sort'],
      limit: ['per_page', 'limit'],
      offset: ['offset'],
      page: ['page'],
      cache: ['cache'],
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

  static create(): RequestQueryBuilder {
    return new RequestQueryBuilder();
  }

  get options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  query(): string {
    this.queryString = (
      this.getFields() +
      this.getCondition('filter') +
      this.getCondition('or') +
      this.getJoin() +
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

  setFilter(filter: QueryFilter): this {
    validateCondition(filter, 'filter');
    this._filter.push(filter);
    return this;
  }

  setOr(or: QueryFilter): this {
    validateCondition(or, 'or');
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

  private getParamName(param: keyof RequestQueryBuilderOptions['paramNamesMap']): string {
    return this.options.paramNamesMap[param][0];
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

    return (
      this[`_${cond}`]
        .map(
          (f: QueryFilter) =>
            `${param}=${f.field}${d}${f.operator}${f.value ? d + f.value : ''}`,
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

    return (
      this._join
        .map(
          (j: QueryJoin) =>
            `${param}=${j.field}${isArrayFull(j.select) ? d + j.select.join(ds) : ''}`,
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

    return (
      this._sort.map((s: QuerySort) => `${param}=${s.field}${ds}${s.order}`).join('&') +
      '&'
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
}

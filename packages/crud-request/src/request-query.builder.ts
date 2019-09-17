import {
  hasValue,
  isObject,
  isString,
  isArrayFull,
  isNil,
  isUndefined,
} from '@nestjsx/util';
import { stringify } from 'qs';

import { RequestQueryBuilderOptions, CreateQueryParams } from './interfaces';
import {
  validateCondition,
  validateFields,
  validateJoin,
  validateNumeric,
  validateSort,
} from './request-query.validator';
import { QueryFields, QuerySearch, QueryFilter, QueryJoin, QuerySort } from './types';

// tslint:disable:variable-name ban-types
export class RequestQueryBuilder {
  constructor() {
    this.setParamNames();
  }

  private static _options: RequestQueryBuilderOptions = {
    delim: '||',
    delimStr: ',',
    paramNamesMap: {
      fields: ['fields', 'select'],
      search: 's',
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
  private paramNames: {
    [key in keyof RequestQueryBuilderOptions['paramNamesMap']]: string;
  } = {};
  public queryObject: { [key: string]: any } = {};
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

  static create(params?: CreateQueryParams): RequestQueryBuilder {
    const qb = new RequestQueryBuilder();
    return isObject(params) ? qb.createFromParams(params) : qb;
  }

  get options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder._options;
  }

  query(encode = true): string {
    if (this.queryObject[this.paramNames.search]) {
      this.queryObject[this.paramNames.filter] = undefined;
      this.queryObject[this.paramNames.or] = undefined;
    }
    this.queryString = stringify(this.queryObject, { encode });
    return this.queryString;
  }

  select(fields: QueryFields): this {
    if (isArrayFull(fields)) {
      validateFields(fields);
      this.queryObject[this.paramNames.fields] = fields.join(this.options.delimStr);
    }
    return this;
  }

  search(s: string | QuerySearch): this {
    if (!isNil(s)) {
      this.queryObject[this.paramNames.search] = s;
    }
    return this;
  }

  setFilter(f: QueryFilter | QueryFilter[]): this {
    this.setCondition(f, 'filter');
    return this;
  }

  setOr(f: QueryFilter | QueryFilter[]): this {
    this.setCondition(f, 'or');
    return this;
  }

  setJoin(j: QueryJoin | QueryJoin[]): this {
    if (!isNil(j)) {
      const param = this.checkQueryObjectParam('join', []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(j) ? j.map((o) => this.addJoin(o)) : [this.addJoin(j)]),
      ];
    }
    return this;
  }

  sortBy(s: QuerySort | QuerySort[]): this {
    if (!isNil(s)) {
      const param = this.checkQueryObjectParam('sort', []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(s) ? s.map((o) => this.addSortBy(o)) : [this.addSortBy(s)]),
      ];
    }
    return this;
  }

  setLimit(n: number): this {
    this.setNumeric(n, 'limit');
    return this;
  }

  setOffset(n: number): this {
    this.setNumeric(n, 'offset');
    return this;
  }

  setPage(n: number): this {
    this.setNumeric(n, 'page');
    return this;
  }

  resetCache(): this {
    this.setNumeric(0, 'cache');
    return this;
  }

  cond(f: QueryFilter, cond: 'filter' | 'or' | 'search' = 'search'): string {
    validateCondition(f, cond);
    const d = this.options.delim;
    return f.field + d + f.operator + d + (hasValue(f.value) ? f.value : '');
  }

  private addJoin(j: QueryJoin): string {
    validateJoin(j);
    const d = this.options.delim;
    const ds = this.options.delimStr;
    return j.field + (isArrayFull(j.select) ? d + j.select.join(ds) : '');
  }

  private addSortBy(s: QuerySort): string {
    validateSort(s);
    const ds = this.options.delimStr;
    return s.field + ds + s.order;
  }

  private createFromParams(params: CreateQueryParams): this {
    this.select(params.fields);
    this.search(params.search);
    this.setFilter(params.filter);
    this.setOr(params.or);
    this.setLimit(params.limit);
    this.setOffset(params.offset);
    this.setPage(params.page);
    if (params.resetCache) {
      this.resetCache();
    }
    return this;
  }

  private checkQueryObjectParam(
    cond: keyof RequestQueryBuilderOptions['paramNamesMap'],
    defaults = undefined,
  ): string {
    const param = this.paramNames[cond];
    if (isNil(this.queryObject[param]) && !isUndefined(defaults)) {
      this.queryObject[param] = defaults;
    }
    return param;
  }

  private setCondition(f: QueryFilter | QueryFilter[], cond: 'filter' | 'or'): void {
    if (!isNil(f)) {
      const param = this.checkQueryObjectParam(cond, []);
      this.queryObject[param] = [
        ...this.queryObject[param],
        ...(Array.isArray(f) ? f.map((o) => this.cond(o, cond)) : [this.cond(f, cond)]),
      ];
    }
  }

  private setNumeric(n: number, cond: 'limit' | 'offset' | 'page' | 'cache'): void {
    if (!isNil(n)) {
      validateNumeric(n, cond);
      this.queryObject[this.paramNames[cond]] = n;
    }
  }

  private setParamNames() {
    Object.keys(RequestQueryBuilder._options.paramNamesMap).forEach((key) => {
      const name = RequestQueryBuilder._options.paramNamesMap[key];
      this.paramNames[key] = isString(name) ? (name as string) : (name[0] as string);
    });
  }
}

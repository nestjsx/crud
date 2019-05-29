import { RequestQueryBuilder } from './request-query.builder';
import {
  validateFields,
  validateCondition,
  validateJoin,
  validateSort,
  validateNumeric,
} from './request-query.validator';
import { RequestQueryException } from './exceptions';
import { isObject, getKeys, isStringFull, isArrayFull, hasLength } from './util';
import { RequestQueryBuilderOptions } from './interfaces';
import {
  QueryFields,
  QueryFilter,
  QueryJoin,
  QuerySort,
  ComparisonOperator,
} from './types';

export class RequestQueryParser {
  private _query: any;
  private _paramNames: string[];

  public fields: QueryFields = [];
  public filter: QueryFilter[] = [];
  public or: QueryFilter[] = [];
  public join: QueryJoin[] = [];
  public sort: QuerySort[] = [];
  public limit: number;
  public offset: number;
  public page: number;
  public cache: number;

  get options(): RequestQueryBuilderOptions {
    return (RequestQueryBuilder as any)._options;
  }

  parse(query: any): this {
    if (isObject(query)) {
      const paramNames = getKeys(query);

      if (hasLength(paramNames)) {
        this._query = query;
        this._paramNames = paramNames;

        this.fields = this.parseParam('fields', this.fieldsParser.bind(this))[0] || [];
        this.filter = this.parseParam(
          'filter',
          this.conditionParser.bind(this, 'filter'),
        );
        this.or = this.parseParam('or', this.conditionParser.bind(this, 'or'));
        this.join = this.parseParam('join', this.joinParser.bind(this));
        this.sort = this.parseParam('sort', this.sortParser.bind(this));
        this.limit = this.parseParam('limit', this.numericParser.bind(this, 'limit'))[0];
        this.offset = this.parseParam(
          'offset',
          this.numericParser.bind(this, 'offset'),
        )[0];
        this.page = this.parseParam('page', this.numericParser.bind(this, 'page'))[0];
        this.cache = this.parseParam('cache', this.numericParser.bind(this, 'cache'))[0];
      }
    }

    return this;
  }

  private getParamNames(
    type: keyof RequestQueryBuilderOptions['paramNamesMap'],
  ): string[] {
    return this._paramNames.filter((p) =>
      this.options.paramNamesMap[type].some((m) => m === p),
    );
  }

  private getParamValues(value: string | string[], parser: Function): string[] {
    if (isStringFull(value)) {
      return [parser.call(this, value)];
    }

    if (isArrayFull(value)) {
      return (value as string[]).map((val) => parser(val));
    }

    return [];
  }

  private parseParam(
    type: keyof RequestQueryBuilderOptions['paramNamesMap'],
    parser: Function,
  ) {
    const param = this.getParamNames(type);

    if (isArrayFull(param)) {
      return param.reduce(
        (a, name) => [...a, ...this.getParamValues(this._query[name], parser)],
        [],
      );
    }

    return [];
  }

  private parseValue(val: any) {
    try {
      const parsed = JSON.parse(val);

      if (isObject(parsed)) {
        // throw new Error('Don\'t support object now');
        return val;
      }

      return parsed;
    } catch (ignored) {
      return val;
    }
  }

  private parseValues(vals: any) {
    if (isArrayFull(vals)) {
      return vals.map((v: any) => this.parseValue(v));
    } else {
      return this.parseValue(vals);
    }
  }

  private fieldsParser(data: string): QueryFields {
    return data.split(this.options.delimStr);
  }

  private conditionParser(cond: 'filter' | 'or', data: string): QueryFilter {
    const isArrayValue = ['in', 'notin', 'between'];
    const isEmptyValue = ['isnull', 'notnull'];
    const param = data.split(this.options.delim);
    const field = param[0];
    const operator = param[1] as ComparisonOperator;
    let value = param[2] || '';

    if (isArrayValue.some((name) => name === operator)) {
      value = value.split(this.options.delimStr) as any;
    }

    value = this.parseValues(value);

    if (!hasLength(value) && !isEmptyValue.some((name) => name === operator)) {
      throw new RequestQueryException(`Invalid ${cond} value`);
    }

    const condition: QueryFilter = { field, operator, value };
    validateCondition(condition, cond);

    return condition;
  }

  private joinParser(data: string): QueryJoin {
    const param = data.split(this.options.delim);
    const join: QueryJoin = {
      field: param[0],
      select: isStringFull(param[1]) ? param[1].split(this.options.delimStr) : undefined,
    };
    validateJoin(join);

    return join;
  }

  private sortParser(data: string): QuerySort {
    const param = data.split(this.options.delimStr);
    const sort: QuerySort = {
      field: param[0],
      order: param[1] as any,
    };
    validateSort(sort);

    return sort;
  }

  private numericParser(
    num: 'limit' | 'offset' | 'page' | 'cache',
    data: string,
  ): number {
    const val = this.parseValue(data);
    validateNumeric(val, num);

    return val;
  }
}

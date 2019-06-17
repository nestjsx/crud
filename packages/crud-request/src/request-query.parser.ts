import { isObject, objKeys, isStringFull, isArrayFull, hasLength } from '@nestjsx/util';

import { RequestQueryBuilder } from './request-query.builder';
import {
  validateCondition,
  validateJoin,
  validateSort,
  validateNumeric,
  validateParamOption,
  validateUUID,
} from './request-query.validator';
import { RequestQueryException } from './exceptions';
import {
  RequestQueryBuilderOptions,
  ParamsOptions,
  ParsedRequestParams,
} from './interfaces';
import {
  QueryFields,
  QueryFilter,
  QueryJoin,
  QuerySort,
  ComparisonOperator,
} from './types';

export class RequestQueryParser implements ParsedRequestParams {
  private _params: any;
  private _query: any;
  private _paramNames: string[];
  private _paramsOptions: ParamsOptions;

  public fields: QueryFields = [];
  public paramsFilter: QueryFilter[] = [];
  public filter: QueryFilter[] = [];
  public or: QueryFilter[] = [];
  public join: QueryJoin[] = [];
  public sort: QuerySort[] = [];
  public limit: number;
  public offset: number;
  public page: number;
  public cache: number;

  static create(): RequestQueryParser {
    return new RequestQueryParser();
  }

  private get _options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder.getOptions();
  }

  getParsed(): ParsedRequestParams {
    return {
      fields: this.fields,
      paramsFilter: this.paramsFilter,
      filter: this.filter,
      or: this.or,
      join: this.join,
      sort: this.sort,
      limit: this.limit,
      offset: this.offset,
      page: this.page,
      cache: this.cache,
    };
  }

  parseQuery(query: any): this {
    if (isObject(query)) {
      const paramNames = objKeys(query);

      if (hasLength(paramNames)) {
        this._query = query;
        this._paramNames = paramNames;

        this.fields =
          this.parseQueryParam('fields', this.fieldsParser.bind(this))[0] || [];
        this.filter = this.parseQueryParam(
          'filter',
          this.conditionParser.bind(this, 'filter'),
        );
        this.or = this.parseQueryParam('or', this.conditionParser.bind(this, 'or'));
        this.join = this.parseQueryParam('join', this.joinParser.bind(this));
        this.sort = this.parseQueryParam('sort', this.sortParser.bind(this));
        this.limit = this.parseQueryParam(
          'limit',
          this.numericParser.bind(this, 'limit'),
        )[0];
        this.offset = this.parseQueryParam(
          'offset',
          this.numericParser.bind(this, 'offset'),
        )[0];
        this.page = this.parseQueryParam(
          'page',
          this.numericParser.bind(this, 'page'),
        )[0];
        this.cache = this.parseQueryParam(
          'cache',
          this.numericParser.bind(this, 'cache'),
        )[0];
      }
    }

    return this;
  }

  parseParams(params: any, options: ParamsOptions): this {
    if (isObject(params)) {
      const paramNames = objKeys(params);

      if (hasLength(paramNames)) {
        this._params = params;
        this._paramsOptions = options;
        this.paramsFilter = paramNames.map((name) => this.paramParser(name));
      }
    }

    return this;
  }

  private getParamNames(
    type: keyof RequestQueryBuilderOptions['paramNamesMap'],
  ): string[] {
    return this._paramNames.filter((p) =>
      this._options.paramNamesMap[type].some((m) => m === p),
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

  private parseQueryParam(
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
    return data.split(this._options.delimStr);
  }

  private conditionParser(cond: 'filter' | 'or', data: string): QueryFilter {
    const isArrayValue = ['in', 'notin', 'between'];
    const isEmptyValue = ['isnull', 'notnull'];
    const param = data.split(this._options.delim);
    const field = param[0];
    const operator = param[1] as ComparisonOperator;
    let value = param[2] || '';

    if (isArrayValue.some((name) => name === operator)) {
      value = value.split(this._options.delimStr) as any;
    }

    value = this.parseValues(value);

    if (
      !hasLength(value) &&
      !isEmptyValue.some((name) => name === operator) &&
      ['boolean', 'number'].indexOf(typeof value) < 0
    ) {
      throw new RequestQueryException(`Invalid ${cond} value`);
    }

    const condition: QueryFilter = { field, operator, value };
    validateCondition(condition, cond);

    return condition;
  }

  private joinParser(data: string): QueryJoin {
    const param = data.split(this._options.delim);
    const join: QueryJoin = {
      field: param[0],
      select: isStringFull(param[1]) ? param[1].split(this._options.delimStr) : undefined,
    };
    validateJoin(join);

    return join;
  }

  private sortParser(data: string): QuerySort {
    const param = data.split(this._options.delimStr);
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

  private paramParser(name: string): QueryFilter {
    validateParamOption(this._paramsOptions, name);
    const option = this._paramsOptions[name];
    const value = this.parseValue(this._params[name]);

    switch (option.type) {
      case 'number':
        validateNumeric(value, `param ${name}`);
        break;
      case 'uuid':
        validateUUID(value, name);
        break;
      default:
        break;
    }

    return { field: option.field, operator: 'eq', value };
  }
}

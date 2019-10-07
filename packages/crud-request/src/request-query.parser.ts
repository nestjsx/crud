import {
  hasLength,
  hasValue,
  isArrayFull,
  isDate,
  isDateString,
  isNil,
  isObject,
  isString,
  isStringFull,
  objKeys,
} from '@nestjsx/util';

import { RequestQueryException } from './exceptions';
import {
  ParamsOptions,
  ParsedRequestParams,
  RequestQueryBuilderOptions,
} from './interfaces';
import { RequestQueryBuilder } from './request-query.builder';
import {
  validateAggregationFunction,
  validateBoolean,
  validateCondition,
  validateField,
  validateJoin,
  validateNumeric,
  validateParamOption,
  validateSort,
  validateUUID,
} from './request-query.validator';
import {
  ComparisonOperator,
  FieldDescription,
  FieldDescriptionArr,
  QueryField,
  QueryFields,
  QueryFilter,
  QueryGroup,
  QueryJoin,
  QuerySort,
  SCondition,
} from './types';

// tslint:disable:variable-name ban-types
export class RequestQueryParser implements ParsedRequestParams {
  public fields: QueryFields = [];
  public paramsFilter: Array<QueryFilter<string>> = [];
  public search: SCondition;
  public searchJson: SCondition;
  public filter: Array<QueryFilter<QueryField>> = [];
  public or: Array<QueryFilter<QueryField>> = [];
  public join: QueryJoin[] = [];
  public group: QueryGroup = [];
  public sort: QuerySort[] = [];
  public limit: number;
  public offset: number;
  public page: number;
  public cache: number;
  public raw: boolean = false;

  private _params: any;
  private _query: any;
  private _paramNames: string[];
  private _paramsOptions: ParamsOptions;

  private get _options(): RequestQueryBuilderOptions {
    return RequestQueryBuilder.getOptions();
  }

  static create(): RequestQueryParser {
    return new RequestQueryParser();
  }

  getParsed(): ParsedRequestParams {
    return {
      fields: this.fields,
      paramsFilter: this.paramsFilter,
      search: this.search,
      filter: this.filter,
      or: this.or,
      join: this.join,
      group: this.group,
      sort: this.sort,
      limit: this.limit,
      offset: this.offset,
      page: this.page,
      cache: this.cache,
      raw: this.raw,
    };
  }

  parseQuery(query: any): this {
    if (isObject(query)) {
      const paramNames = objKeys(query);

      if (hasLength(paramNames)) {
        this._query = query;
        this._paramNames = paramNames;
        const searchData = this._query[this.getParamNames('search')[0]];

        this.search = this.parseSearchQueryParam(searchData) as any;
        if (isNil(this.search)) {
          this.filter = this.parseQueryParam(
            'filter',
            this.conditionParser.bind(this, 'filter'),
          );
          this.or = this.parseQueryParam('or', this.conditionParser.bind(this, 'or'));
        }
        this.fields =
          this.parseQueryParam('fields', this.fieldsParser.bind(this))[0] || [];
        this.join = this.parseQueryParam('join', this.joinParser.bind(this));
        this.group = this.parseQueryParam('group', this.groupParser.bind(this))[0] || [];
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
        this.raw = this.parseQueryParam('raw', this.booleanParser.bind(this, 'raw'))[0];
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
    return this._paramNames.filter((p) => {
      const name = this._options.paramNamesMap[type];
      return isString(name) ? name === p : (name as string[]).some((m) => m === p);
    });
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

      if (!isDate(parsed) && isObject(parsed)) {
        // throw new Error('Don\'t support object now');
        return val;
      } else if (
        typeof parsed === 'number' &&
        parsed.toLocaleString('fullwide', { useGrouping: false }) !== val
      ) {
        // JS cannot handle big numbers. Leave it as a string to prevent data loss
        return val;
      }

      return parsed;
    } catch (ignored) {
      if (isDateString(val)) {
        return new Date(val);
      }

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

  private stringToQueryFieldDescription([
    name,
    alias,
    aggregation,
  ]: FieldDescriptionArr): FieldDescription {
    validateField(name, 'field');
    return {
      name,
      alias: isStringFull(alias) ? alias : undefined,
      aggregation: isStringFull(aggregation)
        ? validateAggregationFunction(aggregation)
        : undefined,
    };
  }

  private fieldsParser(data: string): QueryFields {
    return data.split(this._options.delimStr).map((field) => {
      const split = field.split(this._options.delimParam);
      if (split.length === 3) {
        return this.stringToQueryFieldDescription(split as FieldDescriptionArr);
      }
      validateField(field, 'field');
      return field;
    });
  }

  private parseSearchQueryParam(d: any): SCondition {
    try {
      if (isNil(d)) {
        return undefined;
      }

      const data = JSON.parse(d);

      if (!isObject(data)) {
        throw new Error();
      }

      return data;
    } catch (_) {
      throw new RequestQueryException('Invalid search param. JSON expected');
    }
  }

  private conditionParser(
    cond: 'filter' | 'or' | 'search',
    data: string,
  ): QueryFilter<string> {
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

    if (!isEmptyValue.some((name) => name === operator) && !hasValue(value)) {
      throw new RequestQueryException(`Invalid ${cond} value`);
    }

    const condition: QueryFilter<string> = { field, operator, value };
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

  private groupParser(data: string): QueryGroup {
    return data.split(this._options.delimStr);
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

  private booleanParser(field: 'raw', data: string): boolean {
    const val = this.parseValue(data);
    validateBoolean(val, field);
    return val;
  }

  private paramParser(name: string): QueryFilter<string> {
    validateParamOption(this._paramsOptions, name);
    const option = this._paramsOptions[name];
    let value = this._params[name];

    switch (option.type) {
      case 'number':
        value = this.parseValue(value);
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

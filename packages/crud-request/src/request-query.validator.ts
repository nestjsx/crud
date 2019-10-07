import {
  isArrayFull,
  isArrayStrings,
  isBoolean,
  isEqual,
  isNil,
  isNumber,
  isObject,
  isString,
  isStringFull,
  isUndefined,
} from '@nestjsx/util';

import { RequestQueryException } from './exceptions';
import { ParamsOptions } from './interfaces';
import {
  AggregationFunction,
  ComparisonOperator,
  FieldDescription,
  QueryField,
  QueryFields,
  QueryFilter,
  QueryGroup,
  QueryJoin,
  QuerySort,
} from './types';

export const comparisonOperatorsList = [
  'eq',
  'ne',
  'gt',
  'lt',
  'gte',
  'lte',
  'starts',
  'ends',
  'cont',
  'excl',
  'in',
  'notin',
  'isnull',
  'notnull',
  'between',
];
export const sqlFunctionsList = ['count', 'max', 'min', 'sum', 'avg'];
export const sortOrdersList = ['ASC', 'DESC'];

const comparisonOperatorsListStr = comparisonOperatorsList.join();
const sqlFunctionsListStr = sqlFunctionsList.join();
const sortOrdersListStr = sortOrdersList.join();

export function validateAggregationFunction(fn: string): AggregationFunction {
  if (!sqlFunctionsList.includes(fn)) {
    throw new RequestQueryException(`Invalid function. ${sqlFunctionsListStr} expected`);
  }
  return fn as AggregationFunction;
}

export function validateField(field: string, name: 'field' | 'alias') {
  if (!isStringFull(field)) {
    throw new RequestQueryException(`Invalid ${name}. Not empty string expected`);
  }
}

export function validateFieldDescription({
  name,
  alias,
  aggregation,
}: FieldDescription): void {
  validateField(name, 'field');
  /* istanbul ignore else */
  if (!isUndefined(alias)) {
    validateField(alias, 'alias');
  }
  /* istanbul ignore else */
  if (!isUndefined(aggregation)) {
    validateAggregationFunction(aggregation);
  }
}

export function validateQueryField(field: QueryField) {
  switch (true) {
    case isString(field): {
      validateField(field as string, 'field');
      break;
    }
    case isObject(field): {
      validateFieldDescription(field as FieldDescription);
      break;
    }
    default:
      throw new RequestQueryException(`Invalid field. String or object expected`);
  }
}

export function validateFields(fields: QueryFields): void {
  /* istanbul ignore else */
  if (isArrayFull(fields)) {
    fields.forEach(validateQueryField);
  }
}

export function validateCondition<T extends string | FieldDescription>(
  val: QueryFilter<T>,
  cond: 'filter' | 'or' | 'search',
): void {
  if (!isObject(val) || validateQueryField(val.field)) {
    throw new RequestQueryException(
      `Invalid field type in ${cond} condition. String expected`,
    );
  }
  validateComparisonOperator(val.operator);
}

export function validateComparisonOperator(operator: ComparisonOperator): void {
  if (!comparisonOperatorsList.includes(operator)) {
    throw new RequestQueryException(
      `Invalid comparison operator. ${comparisonOperatorsListStr} expected`,
    );
  }
}

export function validateJoin(join: QueryJoin): void {
  if (!isObject(join) || !isStringFull(join.field)) {
    throw new RequestQueryException('Invalid join field. String expected');
  }
  if (!isUndefined(join.select) && !isArrayStrings(join.select)) {
    throw new RequestQueryException('Invalid join select. Array of strings expected');
  }
}

export function validateGroup(group: QueryGroup): void {
  if (!isArrayStrings(group)) {
    throw new RequestQueryException('Invalid group field. Array of strings expected');
  }
}

export function validateSort(sort: QuerySort): void {
  if (!isObject(sort) || !isStringFull(sort.field)) {
    throw new RequestQueryException('Invalid sort field. String expected');
  }
  if (
    !isEqual(sort.order, sortOrdersList[0]) &&
    !isEqual(sort.order, sortOrdersList[1])
  ) {
    throw new RequestQueryException(`Invalid sort order. ${sortOrdersListStr} expected`);
  }
}

export function validateNumeric(
  val: number,
  num: 'limit' | 'offset' | 'page' | 'cache' | string,
): void {
  if (!isNumber(val)) {
    throw new RequestQueryException(`Invalid ${num}. Number expected`);
  }
}

export function validateBoolean(val: any, field: 'raw' | string) {
  if (!isBoolean(val)) {
    throw new RequestQueryException(`Invalid ${field}. Boolean expected`);
  }
}

export function validateParamOption(options: ParamsOptions, name: string) {
  if (!isObject(options)) {
    throw new RequestQueryException(`Invalid param ${name}. Invalid crud options`);
  }
  const option = options[name];
  if (!isObject(option) || isNil(option.field) || isNil(option.type)) {
    throw new RequestQueryException(`Invalid param option in Crud`);
  }
}

export function validateUUID(str: string, name: string) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidV4.test(str) && !uuid.test(str)) {
    throw new RequestQueryException(`Invalid param ${name}. UUID string expected`);
  }
}

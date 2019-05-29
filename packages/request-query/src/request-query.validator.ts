import { RequestQueryException } from './exceptions';
import {
  QueryFields,
  QueryFilter,
  ComparisonOperator,
  QueryJoin,
  QuerySort,
} from './types';
import {
  isUndefined,
  isArrayStrings,
  isStringFull,
  isObject,
  isEqual,
  isNumber,
} from './util';

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
export const sortOrdersList = ['ASC', 'DESC'];

const comparisonOperatorsListStr = comparisonOperatorsList.join();
const sortOrdersListStr = sortOrdersList.join();

export function validateFields(fields: QueryFields): void {
  if (!isArrayStrings(fields)) {
    throw new RequestQueryException('Invalid fields. Array of strings expected');
  }
}

export function validateCondition(val: QueryFilter, cond: 'filter' | 'or'): void {
  if (!isObject(val) || !isStringFull(val.field)) {
    throw new RequestQueryException(`Invalid ${cond} field. String expected`);
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
  num: 'limit' | 'offset' | 'page' | 'cache',
): void {
  if (!isNumber(val)) {
    throw new RequestQueryException(`Invalid ${num}. Number expected`);
  }
}

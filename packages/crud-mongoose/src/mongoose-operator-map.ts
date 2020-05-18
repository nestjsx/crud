import { OperatorMap } from '@nestjsx/crud-request';

export const MONGOOSE_OPERATOR_MAP: OperatorMap = {
  $eq: (value) => [
    {
      operator: '$eq',
      value,
    },
  ],
  $ne: (value) => [
    {
      operator: '$ne',
      value,
    },
  ],
  $gt: (value) => [{ operator: '$gt', value }],
  $lt: (value) => [{ operator: '$lt', value }],
  $gte: (value) => [{ operator: '$gte', value }],
  $lte: (value) => [{ operator: '$lte', value }],
  $in: (value) => [{ operator: '$in', value }],
  $notin: (value) => [{ operator: '$nin', value }],
  $isnull: () => [{ operator: '$eq', value: null }],
  $notnull: () => [{ operator: '$ne', value: null }],
  $between: (value: any[]) => [
    { operator: '$gt', value: Math.min(...value) },
    {
      operator: '$lt',
      value: Math.max(...value),
    },
  ],
  $starts: (value) => [{ operator: '$regex', value: `/^${value}.*$/` }],
  $end: (value) => [{ operator: '$regex', value: `/^.*${value}$/` }],
  $cont: (value) => [{ operator: '$regex', value: `/^.*${value}.*$/` }],
  $excl: (value) => [{ operator: '$regex', value: `/^((?!${value}).)*$/` }],
};

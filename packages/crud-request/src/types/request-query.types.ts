export enum AggrFunction {
  COUNT = 'count',
  MAX = 'max',
  MIN = 'min',
  SUM = 'sum',
  AVG = 'avg',
}

export type AggregationFunction = 'count' | 'max' | 'min' | 'sum' | 'avg';

export type FieldAlias = {
  alias: string;
};

export type FieldDescription = {
  name: string;
  aggregation?: AggregationFunction;
} & Partial<FieldAlias>;

export type FieldDescriptionArr = [string, string, string];

export type QueryField = string | FieldDescription;

export type QueryFields = QueryField[];

export type QueryFilter<T extends QueryField = QueryField> = {
  field: T;
  operator: ComparisonOperator;
  value?: any;
};

export type QueryFilterArr<T extends QueryField = QueryField> = [
  T,
  ComparisonOperator,
  any?,
];

export type QueryJoin = {
  field: string;
  select?: QueryFields;
};

export type QueryJoinArr = [string, QueryFields?];

export type QueryGroup = QueryFields;

export type SortField = string | FieldAlias;

export type QuerySort<T extends SortField = SortField> = {
  field: T;
  order: QuerySortOperator;
};

export type QuerySortArr<T extends SortField = SortField> = [T, QuerySortOperator];

export type ComparisonOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'starts'
  | 'ends'
  | 'cont'
  | 'excl'
  | 'in'
  | 'notin'
  | 'isnull'
  | 'notnull'
  | 'between'
  | keyof SFieldOperator;
export type QuerySortOperator = 'ASC' | 'DESC';

export enum CondOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  LOWER_THAN = 'lt',
  GREATER_THAN_EQUALS = 'gte',
  LOWER_THAN_EQUALS = 'lte',
  STARTS = 'starts',
  ENDS = 'ends',
  CONTAINS = 'cont',
  EXCLUDES = 'excl',
  IN = 'in',
  NOT_IN = 'notin',
  IS_NULL = 'isnull',
  NOT_NULL = 'notnull',
  BETWEEN = 'between',
}

// new search
export type SPrimitivesVal = string | number | boolean;
export type SFiledValues = SPrimitivesVal | Array<SPrimitivesVal>;
export type SFieldOperator = {
  $eq?: SFiledValues;
  $ne?: SFiledValues;
  $gt?: SFiledValues;
  $lt?: SFiledValues;
  $gte?: SFiledValues;
  $lte?: SFiledValues;
  $starts?: SFiledValues;
  $ends?: SFiledValues;
  $cont?: SFiledValues;
  $excl?: SFiledValues;
  $in?: SFiledValues;
  $notin?: SFiledValues;
  $between?: SFiledValues;
  $isnull?: SFiledValues;
  $notnull?: SFiledValues;
  $or?: SFieldOperator;
  $and?: never;
};
export type SField = SPrimitivesVal | SFieldOperator;

export type SFields = {
  [key: string]: SField | Array<SFields | SConditionAND> | undefined;
  $or?: Array<SFields | SConditionAND>;
  $and?: never;
};

export type SConditionAND = {
  $and?: Array<SFields | SConditionAND>;
  $or?: never;
};

export type SConditionKey = '$and' | '$or';

export type SCondition = SFields | SConditionAND;

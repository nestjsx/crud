export type QueryFields<K extends string = string> = K[];

export type QueryFilter<K extends string = string> = {
  field: K;
  operator: ComparisonOperator;
  value?: any;
};

export type QueryFilterArr<K extends string = string> = [K, ComparisonOperator, any?];

export type QueryJoin<K extends string = string> = {
  field: K;
  select?: QueryFields<K>;
};

export type QueryJoinArr<K extends string = string> = [K, QueryFields<K>?];

export type QuerySort<K extends string = string> = {
  field: K;
  order: QuerySortOperator;
};

export type QuerySortArr<K extends string = string> = [K, QuerySortOperator];

export type QuerySortOperator = 'ASC' | 'DESC';

type DeprecatedCondOperator =
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
  | 'between';

export enum CondOperator {
  EQUALS = '$eq',
  NOT_EQUALS = '$ne',
  GREATER_THAN = '$gt',
  LOWER_THAN = '$lt',
  GREATER_THAN_EQUALS = '$gte',
  LOWER_THAN_EQUALS = '$lte',
  STARTS = '$starts',
  ENDS = '$ends',
  CONTAINS = '$cont',
  EXCLUDES = '$excl',
  IN = '$in',
  NOT_IN = '$notin',
  IS_NULL = '$isnull',
  NOT_NULL = '$notnull',
  BETWEEN = '$between',
  EQUALS_LOW = '$eqL',
  NOT_EQUALS_LOW = '$neL',
  STARTS_LOW = '$startsL',
  ENDS_LOW = '$endsL',
  CONTAINS_LOW = '$contL',
  EXCLUDES_LOW = '$exclL',
  IN_LOW = '$inL',
  NOT_IN_LOW = '$notinL',
}

export type ComparisonOperator = DeprecatedCondOperator | keyof SFieldOperator;

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
  $eqL?: SFiledValues;
  $neL?: SFiledValues;
  $startsL?: SFiledValues;
  $endsL?: SFiledValues;
  $contL?: SFiledValues;
  $exclL?: SFiledValues;
  $inL?: SFiledValues;
  $notinL?: SFiledValues;
  $or?: SFieldOperator;
  $and?: never;
};

export type SField = SPrimitivesVal | SFieldOperator;

export type SFields<K extends string = string> = {
  $or?: Array<SFields<K> | SConditionAND<K>>;
  $and?: never;
} & {
  [key in K]?: SField | Array<SFields<K> | SConditionAND<K>> | undefined;
};

export type SConditionAND<K extends string = string> = {
  $and?: Array<SFields<K> | SConditionAND<K>>;
  $or?: never;
};

export type SConditionKey = '$and' | '$or';

export type SCondition<K extends string = string> = SFields<K> | SConditionAND<K>;

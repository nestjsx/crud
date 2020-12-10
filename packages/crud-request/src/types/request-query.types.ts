export type QueryFields = string[];

export type QueryFilter = {
  field: string;
  operator: ComparisonOperator;
  value?: any;
};

export type QueryFilterArr = [string, ComparisonOperator, any?];

export type QueryJoin = {
  field: string;
  select?: QueryFields;
};

export type QueryJoinArr = [string, QueryFields?];

export type QuerySort = {
  field: string;
  order: QuerySortOperator;
  nulls?: QuerySortNullsPriority;
};

export type QuerySortArr = [string, QuerySortOperator];

export type QuerySortOperator = 'ASC' | 'DESC';
export type QuerySortNullsPriority = 'NULLS FIRST' | 'NULLS LAST';

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

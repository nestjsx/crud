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
};

export type QuerySortArr = [string, QuerySortOperator];

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
  | 'between'
  | 'contArr'
  | 'intersectsArr';

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
  CONTAINS_ARRAY = '$contArr',
  INTERSECTS_ARRAY = '$intersectsArr',
}

export type ComparisonOperator = DeprecatedCondOperator | keyof SFieldOperator;

// new search
export type SPrimitivesVal = string | number | boolean;

export type SFieldValues = SPrimitivesVal | Array<SPrimitivesVal>;
// DEPRECATED: remove before next major release (or other breaking change)
export type SFiledValues = SFieldValues;

export type SFieldOperator = {
  $eq?: SFieldValues;
  $ne?: SFieldValues;
  $gt?: SFieldValues;
  $lt?: SFieldValues;
  $gte?: SFieldValues;
  $lte?: SFieldValues;
  $starts?: SFieldValues;
  $ends?: SFieldValues;
  $cont?: SFieldValues;
  $excl?: SFieldValues;
  $in?: SFieldValues;
  $notin?: SFieldValues;
  $between?: SFieldValues;
  $isnull?: SFieldValues;
  $notnull?: SFieldValues;
  $eqL?: SFieldValues;
  $neL?: SFieldValues;
  $startsL?: SFieldValues;
  $endsL?: SFieldValues;
  $contL?: SFieldValues;
  $exclL?: SFieldValues;
  $inL?: SFieldValues;
  $notinL?: SFieldValues;
  $contArr?: Array<SPrimitivesVal>;
  $intersectsArr?: Array<SPrimitivesVal>;
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

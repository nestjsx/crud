export type QueryFields = string[];

export type QuerySearch = string | string[] | QuerySearchAnd | QuerySearchOr;
export type QuerySearchAnd = {
  and: Array<string | QuerySearchAnd | QuerySearchOr>;
  or?: never;
};
export type QuerySearchOr = {
  or: Array<string | QuerySearchAnd | QuerySearchOr>;
  and?: never;
};

export type QuerySearchParsed =
  | QueryFilter
  | QueryFilter[]
  | QuerySearchAndParsed
  | QuerySearchOrParsed;
export type QuerySearchAndParsed = {
  and: Array<QueryFilter | QuerySearchAndParsed | QuerySearchOrParsed>;
  or?: never;
};
export type QuerySearchOrParsed = {
  or: Array<QueryFilter | QuerySearchAndParsed | QuerySearchOrParsed>;
  and?: never;
};

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
  | 'between';
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

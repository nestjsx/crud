export type QueryFields = string[];

export type QueryFilter = {
  field: string;
  operator: ComparisonOperator;
  value?: any;
};

export type QueryJoin = {
  field: string;
  select?: QueryFields;
};

export type QuerySort = {
  field: string;
  order: 'ASC' | 'DESC';
};

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

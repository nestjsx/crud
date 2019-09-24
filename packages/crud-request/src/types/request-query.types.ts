export type QueryFields = string[];

export interface QueryFilter {
  field: string;
  operator: ComparisonOperator;
  value?: any;
}

export interface QueryJoin {
  field: string;
  select?: QueryFields;
}

export interface QuerySort {
  field: string;
  order: "ASC" | "DESC";
}

export type ComparisonOperator =
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "starts"
  | "ends"
  | "cont"
  | "excl"
  | "in"
  | "notin"
  | "isnull"
  | "notnull"
  | "between";

export enum CondOperator {
  EQUALS = "eq",
  NOT_EQUALS = "ne",
  GREATER_THAN = "gt",
  LOWER_THAN = "lt",
  GREATER_THAN_EQUALS = "gte",
  LOWER_THAN_EQAULS = "lte",
  STARTS = "starts",
  ENDS = "ends",
  CONTAINS = "cont",
  EXCLUDES = "excl",
  IN = "in",
  NOT_IN = "notin",
  IS_NULL = "isnull",
  NOT_NULL = "notnull",
  BETWEEN = "between"
}

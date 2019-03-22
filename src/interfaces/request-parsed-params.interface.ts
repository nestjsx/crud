import { ComparisonOperator } from '../types';

export interface RequestParamsParsed {
  fields?: string[];
  filter?: FilterParamParsed[];
  or?: FilterParamParsed[];
  join?: JoinParamParsed[];
  sort?: SortParamParsed[];
  limit?: number;
  offset?: number;
  page?: number;
  cache?: number;
}

export interface FilterParamParsed {
  field: string;
  operator: ComparisonOperator;
  value?: any;
}

export interface JoinParamParsed {
  field: string;
  select?: string[];
}

export interface SortParamParsed {
  field: string;
  order: 'ASC' | 'DESC';
}

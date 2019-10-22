import { ObjectLiteral } from '@nestjsx/util';
import {
  FieldAlias,
  QueryField,
  QueryFields,
  QueryFilter,
  QueryGroup,
  QueryJoin,
  QuerySort,
  SCondition,
} from '../types';

export interface ParsedRequestParams {
  fields: QueryFields;
  paramsFilter: Array<QueryFilter<string>>;
  authFilter: ObjectLiteral;
  authPersist: ObjectLiteral;
  search: SCondition;
  filter: QueryFilter[];
  or: QueryFilter[];
  join: QueryJoin[];
  group: QueryGroup;
  sort: QuerySort[];
  limit: number;
  offset: number;
  page: number;
  cache: number;
  raw: boolean;
}

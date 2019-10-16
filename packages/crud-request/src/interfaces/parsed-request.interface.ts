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
  filter: Array<QueryFilter<QueryField>>;
  or: Array<QueryFilter<QueryField>>;
  join: QueryJoin[];
  group: QueryGroup;
  sort: Array<QuerySort<string | FieldAlias>>;
  limit: number;
  offset: number;
  page: number;
  cache: number;
  raw: boolean;
}

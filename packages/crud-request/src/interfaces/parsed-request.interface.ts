import { ObjectLiteral } from '@nestjsx/util';
import { ClassTransformOptions } from 'class-transformer';
import { QueryFields, QueryFilter, QueryJoin, QuerySort, SCondition } from '../types';

export interface ParsedRequestParams {
  fields: QueryFields;
  paramsFilter: QueryFilter[];
  authPersist: ObjectLiteral;
  classTransformOptions: ClassTransformOptions;
  search: SCondition;
  filter: QueryFilter[];
  or: QueryFilter[];
  join: QueryJoin[];
  sort: QuerySort[];
  limit: number;
  offset: number;
  page: number;
  cache: number;
  includeDeleted: number;
}

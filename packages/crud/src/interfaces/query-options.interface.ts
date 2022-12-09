import { QueryFields, QuerySort } from '@nestjsx/crud-request/lib/types/request-query.types';

import { QueryFilterOption } from '../types';

export interface QueryOptions {
  allow?: QueryFields;
  exclude?: QueryFields;
  persist?: QueryFields;
  filter?: QueryFilterOption;
  join?: JoinOptions;
  loadRelationIds?: LoadRelationIdsOptions;
  sort?: QuerySort[];
  limit?: number;
  maxLimit?: number;
  cache?: number | false;
  alwaysPaginate?: boolean;
  softDelete?: boolean;
}

export interface JoinOptions {
  [key: string]: JoinOption;
}

export interface JoinOption {
  alias?: string;
  allow?: QueryFields;
  eager?: boolean;
  exclude?: QueryFields;
  persist?: QueryFields;
  select?: false;
  required?: boolean;
}

export interface LoadRelationIdsOptions {
  relations?: string[];
  disableMixedMap?: boolean;
}

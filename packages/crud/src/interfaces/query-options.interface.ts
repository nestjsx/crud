import {
  FieldAlias,
  FieldDescription,
  QueryFields,
  QueryFilter,
  QuerySort,
  SCondition,
} from '@nestjsx/crud-request/lib/types/request-query.types';

export interface QueryOptions {
  allow?: QueryFields;
  exclude?: QueryFields;
  persist?: QueryFields;
  filter?: Array<QueryFilter<string | FieldDescription>> | SCondition;
  join?: JoinOptions;
  sort?: Array<QuerySort<string | FieldAlias>>;
  limit?: number;
  maxLimit?: number;
  cache?: number | false;
}

export interface JoinOptions {
  [key: string]: JoinOption;
}

export interface JoinOption {
  allow?: QueryFields;
  exclude?: QueryFields;
  persist?: QueryFields;
  eager?: boolean;
  required?: boolean;
  alias?: string;
}

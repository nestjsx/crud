export interface RequestQueryParams {
  fields?: string;
  filter?: string[];
  'filter[]'?: string[];
  or?: string[];
  'or[]'?: string[];
  sort: string[];
  'sort[]': string[];
  join: string[];
  'join[]': string[];
  limit?: string;
  per_page?: string;
  take?: string;
  offset?: string;
  skip?: string;
  page?: string;
  cache?: string;
}

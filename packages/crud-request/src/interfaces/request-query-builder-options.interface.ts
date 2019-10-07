export interface RequestQueryBuilderOptions {
  delim?: string;
  delimStr?: string;
  delimParam?: string;
  paramNamesMap?: {
    fields?: string | string[];
    search?: string | string[];
    filter?: string | string[];
    or?: string | string[];
    join?: string | string[];
    sort?: string | string[];
    limit?: string | string[];
    offset?: string | string[];
    page?: string | string[];
    cache?: string | string[];
    group?: string | string[];
    raw?: string | string[];
  };
}

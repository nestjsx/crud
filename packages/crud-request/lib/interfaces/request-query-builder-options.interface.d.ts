export interface RequestQueryBuilderOptions {
    delim?: string;
    delimStr?: string;
    paramNamesMap?: {
        fields?: string[];
        filter?: string[];
        or?: string[];
        join?: string[];
        sort?: string[];
        limit?: string[];
        offset?: string[];
        page?: string[];
        cache?: string[];
    };
}

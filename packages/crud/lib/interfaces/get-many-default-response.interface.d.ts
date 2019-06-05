export interface GetManyDefaultResponse<T> {
    data: T[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
}

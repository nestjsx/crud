export interface CustomOperators {
  [key: string]: (field: string, param: string) => string;
}

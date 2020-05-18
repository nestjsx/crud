export interface OperatorMap {
  [key: string]: (value?: any) => Array<{ operator: string; value: any }>;
}

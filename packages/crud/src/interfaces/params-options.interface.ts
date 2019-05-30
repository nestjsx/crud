import { ParamOptionType } from '@nestjsx/request-query/lib/types/request-param.types';

export interface ParamsOptions {
  [key: string]: ParamOption;
}

export interface ParamOption {
  field: string;
  type: ParamOptionType;
  primary?: boolean;
}

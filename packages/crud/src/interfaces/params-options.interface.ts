import { ParamOptionType } from '@nestjsx/crud-request';

export interface ParamsOptions {
  [key: string]: ParamOption;
}

export interface ParamOption {
  field?: string;
  type?: ParamOptionType;
  primary?: boolean;
  disabled?: boolean;
}

import { SCondition } from '../../crud-request';
import { ObjectLiteral } from '../../utils';
import { ClassTransformOptions } from 'class-transformer';

export interface AuthGlobalOptions {
  property?: string;
  /** Get options for the `classToPlain` function (response) */
  classTransformOptions?: (req: any) => ClassTransformOptions;
  /** Get `groups` value for the `classToPlain` function options (response) */
  groups?: (req: any) => string[];
}

export interface AuthOptions {
  property?: string;
  /** Get options for the `classToPlain` function (response) */
  classTransformOptions?: (req: any) => ClassTransformOptions;
  /** Get `groups` value for the `classToPlain` function options (response) */
  groups?: (req: any) => string[];
  filter?: (req: any) => SCondition | void;
  or?: (req: any) => SCondition | void;
  persist?: (req: any) => ObjectLiteral;
}

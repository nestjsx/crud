import { objKeys } from './obj.util';

export const isUndefined = (val: any): boolean => typeof val === 'undefined';
export const isNull = (val: any): boolean => val === null;
export const isNil = (val: any): boolean => isUndefined(val) || isNull(val);
export const isString = (val: any): boolean => typeof val === 'string';
export const hasLength = (val: any): boolean => val.length > 0;
export const isStringFull = (val: any): boolean => isString(val) && hasLength(val);
export const isArrayFull = (val: any): boolean => Array.isArray(val) && hasLength(val);
export const isArrayStrings = (val: any): boolean =>
  isArrayFull(val) && (val as string[]).every((v) => isStringFull(v));
export const isObject = (val: any): boolean => typeof val === 'object' && !isNull(val);
export const isObjectFull = (val: any) => isObject(val) && hasLength(objKeys(val));
export const isNumber = (val: any): boolean =>
  typeof val === 'number' && !Number.isNaN(val) && Number.isFinite(val);
export const isEqual = (val: any, eq: any): boolean => val === eq;
export const isFalse = (val: any): boolean => val === false;
export const isTrue = (val: any): boolean => val === true;
export const isIn = (val: any, arr: any[] = []): boolean =>
  arr.some((o) => isEqual(val, o));

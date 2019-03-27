import { extendArrayMetadata } from '@nestjs/common/utils/extend-metadata.util';
import { INTERCEPTORS_METADATA } from '@nestjs/common/constants';

import { RestfulQueryInterceptor, RestfulParamsInterceptor } from '../interceptors';

export function UsePathInterceptors(...names: Array<'query' | 'param'>) {
  return (target: any, key?, descriptor?) => {
    const all = ['query', 'param'];
    const every = (arr: string[]): boolean => all.every((n) => arr.some((name) => name === n));
    const some = (arr: string[], name: string): boolean => arr.some((n) => name === n);
    let interceptors: any[] = [];

    if (!names.length || every(names)) {
      interceptors = [RestfulQueryInterceptor, RestfulParamsInterceptor];
    } else if (some(names, 'query')) {
      interceptors = [RestfulQueryInterceptor];
    } else if (some(names, 'param')) {
      interceptors = [RestfulParamsInterceptor];
    }

    if (descriptor) {
      extendArrayMetadata(INTERCEPTORS_METADATA, interceptors, descriptor.value);
      return descriptor;
    }

    extendArrayMetadata(INTERCEPTORS_METADATA, interceptors, target);
    return target;
  };
}

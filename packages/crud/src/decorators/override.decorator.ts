import { BaseRouteName } from '../types/base-route-name.type';
import { OVERRIDE_METHOD_METADATA } from '../constants';

export const Override = (name?: BaseRouteName) => (
  target,
  key,
  descriptor: PropertyDescriptor,
) => {
  Reflect.defineMetadata(OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
  return descriptor;
};

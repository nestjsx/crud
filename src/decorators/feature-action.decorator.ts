import { ReflectMetadata, Type } from '@nestjs/common';

import { FEAUTURE_NAME_METADATA, ACTION_NAME_METADATA } from '../constants';

export const Feature = (name: string) => ReflectMetadata(FEAUTURE_NAME_METADATA, name);
export const Action = (name: string) => ReflectMetadata(ACTION_NAME_METADATA, name);
export const getFeature = <T = any>(target: Type<T>) =>
  Reflect.getMetadata(FEAUTURE_NAME_METADATA, target);
export const getAction = (target: Function) => Reflect.getMetadata(ACTION_NAME_METADATA, target);

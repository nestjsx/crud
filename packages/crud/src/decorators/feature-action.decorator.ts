import { SetMetadata, Type } from '@nestjs/common';

import { ACTION_NAME_METADATA, FEAUTURE_NAME_METADATA } from '../constants';

export const Feature = (name: string) => SetMetadata(FEAUTURE_NAME_METADATA, name);
export const Action = (name: string) => SetMetadata(ACTION_NAME_METADATA, name);

export const getFeature = <T = any>(target: Type<T>) =>
  Reflect.getMetadata(FEAUTURE_NAME_METADATA, target);
export const getAction = (target: Function) =>
  Reflect.getMetadata(ACTION_NAME_METADATA, target);

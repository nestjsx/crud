import 'reflect-metadata';
import * as crypto from 'crypto';
import { RequestMethod } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { PATH_METADATA, METHOD_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

const BASE_PATH_METADATA = 'BASE_PATH_METADATA';
const BASE_METHOD_METADATA = 'BASE_METHOD_METADATA';
const OVERRIDE_METHOD_METADATA = 'OVERRIDE_METHOD_METADATA';

export const Route = (method: RequestMethod = RequestMethod.GET, path: string = '/') => {
  return (target, key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(BASE_PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(BASE_METHOD_METADATA, method, descriptor.value);

    return descriptor;
  };
};

export const Inherit = () => (target: object) => {
  const baseController = Object.getPrototypeOf(target);
  const methods = Object.getOwnPropertyNames(baseController.prototype);
  const prototype = (target as any).prototype;

  methods.forEach((name) => {
    const path = Reflect.getMetadata(BASE_PATH_METADATA, baseController.prototype[name]);
    const method = Reflect.getMetadata(BASE_METHOD_METADATA, baseController.prototype[name]);
    const override = Reflect.getMetadata(OVERRIDE_METHOD_METADATA, baseController.prototype[name]);

    if (!isNil(path) && !isNil(method)) {
      if (override) {
        const random = crypto.randomBytes(16).toString('hex');
        const overrideName = `${override}Override${random}`;

        // set override function
        prototype[overrideName] = function(...args) {
          return this[name](...args);
        };

        // copy params metadata
        const paramsMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, override);
        if (paramsMetadata) {
          Reflect.defineMetadata(ROUTE_ARGS_METADATA, paramsMetadata, target, overrideName);
        }

        // copy metadata from parent method
        const metadataKeys = Reflect.getMetadataKeys(prototype[name]);
        if (metadataKeys && metadataKeys.length) {
          metadataKeys.forEach((key) => {
            const metadata = Reflect.getMetadata(key, prototype[name]);
            Reflect.defineMetadata(key, metadata, prototype[overrideName]);
          });
        }

        // set path and method for overrided
        Reflect.defineMetadata(PATH_METADATA, path, prototype[overrideName]);
        Reflect.defineMetadata(METHOD_METADATA, method, prototype[overrideName]);
      } else {
        // set path and method for base
        Reflect.defineMetadata(PATH_METADATA, path, prototype[name]);
        Reflect.defineMetadata(METHOD_METADATA, method, prototype[name]);
      }
    }
  });
};

export const Override = () => {
  return (target, key, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(OVERRIDE_METHOD_METADATA, key, Object.getPrototypeOf(target)[key]);

    return descriptor;
  };
};

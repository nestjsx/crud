import { objKeys } from '@nestjsx/util';

import { safeRequire } from '../util';
import { R } from './reflection.helper';
import { ParamsOptions } from '../interfaces';
import { BaseRouteName } from '../types';

export const swaggerPkg = safeRequire('@nestjs/swagger/dist/constants');

export class Swagger {
  static operationsMap(modelName): { [key in BaseRouteName]: string } {
    return {
      getManyBase: `Retrieve many ${modelName}`,
      getOneBase: `Retrieve one ${modelName}`,
      createManyBase: `Create many ${modelName}`,
      createOneBase: `Create one ${modelName}`,
      updateOneBase: `Update one ${modelName}`,
      deleteOneBase: `Delete one ${modelName}`,
    };
  }

  static setOperation(name: BaseRouteName, modelName: string, func: Function) {
    if (swaggerPkg) {
      const summary = Swagger.operationsMap(modelName)[name];
      R.set(swaggerPkg.DECORATORS.API_OPERATION, { summary }, func);
    }
  }

  static setParams(metadata: any, func: Function) {
    if (swaggerPkg) {
      R.set(swaggerPkg.DECORATORS.API_PARAMETERS, metadata, func);
    }
  }

  static getOperation(func: Function): any {
    return swaggerPkg ? R.get(swaggerPkg.DECORATORS.API_OPERATION, func) || {} : {};
  }

  static getParams(func: Function): any[] {
    return swaggerPkg ? R.get(swaggerPkg.DECORATORS.API_PARAMETERS, func) || [] : [];
  }

  static createPathParamMeta(options: ParamsOptions): any {
    return swaggerPkg
      ? objKeys(options).map((param) => ({
          name: param,
          required: true,
          in: 'path',
          type: options[param].type === 'number' ? Number : String,
        }))
      : [];
  }
}

import { HttpStatus } from '@nestjs/common';
import { objKeys } from '@nestjsx/util';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

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
    /* istanbul ignore else */
    if (swaggerPkg) {
      const summary = Swagger.operationsMap(modelName)[name];
      R.set(swaggerPkg.DECORATORS.API_OPERATION, { summary }, func);
    }
  }

  static setParams(metadata: any, func: Function) {
    /* istanbul ignore else */
    if (swaggerPkg) {
      R.set(swaggerPkg.DECORATORS.API_PARAMETERS, metadata, func);
    }
  }

  static setResponseOk(metadata: any, func: Function) {
    /* istanbul ignore else */
    if (swaggerPkg) {
      R.set(swaggerPkg.DECORATORS.API_RESPONSE, metadata, func);
    }
  }

  static getOperation(func: Function): any {
    /* istanbul ignore next */
    return swaggerPkg ? R.get(swaggerPkg.DECORATORS.API_OPERATION, func) || {} : {};
  }

  static getParams(func: Function): any[] {
    /* istanbul ignore next */
    return swaggerPkg ? R.get(swaggerPkg.DECORATORS.API_PARAMETERS, func) || [] : [];
  }

  static getResponseOk(func: Function): any {
    /* istanbul ignore next */
    return swaggerPkg ? R.get(swaggerPkg.DECORATORS.API_RESPONSE, func) || {} : {};
  }

  static createReponseOkMeta(status: HttpStatus, isArray: boolean, dto: any): any {
    return swaggerPkg
      ? {
          [status]: {
            type: dto,
            isArray,
            description: '',
          },
        }
      : /* istanbul ignore next */ {};
  }

  static createPathParasmMeta(options: ParamsOptions): any[] {
    return swaggerPkg
      ? objKeys(options).map((param) => ({
          name: param,
          required: true,
          in: 'path',
          type: options[param].type === 'number' ? Number : String,
        }))
      : /* istanbul ignore next */ [];
  }

  static createQueryParamsMeta(name: BaseRouteName) {
    /* istanbul ignore if */
    if (!swaggerPkg) {
      return [];
    }

    const {
      delim,
      delimStr: coma,
      fields,
      filter,
      or,
      join,
      sort,
      limit,
      offset,
      page,
      cache,
    } = Swagger.getQueryParamsNames();

    // TODO: finish this
    switch (name) {
      case 'getManyBase':
        return [
          {
            name: fields,
            // tslint:disable-next-line:max-line-length
            description: `<h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?${fields}=field1${coma}field2${coma}...</strong> <br/><i>Example:</i> <strong>?${fields}=email${coma}name</strong>`,
            required: false,
            in: 'query',
            type: String,
          },
        ];
      case 'getOneBase':
        return [];
      default:
        return [];
    }
  }

  static getQueryParamsNames() {
    const qbOptions = RequestQueryBuilder.getOptions();
    const name = (n) => qbOptions.paramNamesMap[n][0];

    return {
      delim: qbOptions.delim,
      delimStr: qbOptions.delimStr,
      fields: name('fields'),
      filter: name('filter'),
      or: name('or'),
      join: name('join'),
      sort: name('sort'),
      limit: name('limit'),
      offset: name('offset'),
      page: name('page'),
      cache: name('cache'),
    };
  }
}

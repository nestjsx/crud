import { HttpStatus } from '@nestjs/common';
import { objKeys, isString } from '@nestjsx/util';
import { RequestQueryBuilder } from '@nestjsx/crud-request';

import { safeRequire } from '../util';
import { R } from './reflection.helper';
import { ParamsOptions } from '../interfaces';
import { BaseRouteName } from '../types';

export const swaggerConst = safeRequire('@nestjs/swagger/dist/constants');
export const swaggerPkgJson = safeRequire('@nestjs/swagger/package.json');

export class Swagger {
  static operationsMap(modelName): { [key in BaseRouteName]: string } {
    return {
      getManyBase: `Retrieve many ${modelName}`,
      getOneBase: `Retrieve one ${modelName}`,
      createManyBase: `Create many ${modelName}`,
      createOneBase: `Create one ${modelName}`,
      updateOneBase: `Update one ${modelName}`,
      replaceOneBase: `Replace one ${modelName}`,
      deleteOneBase: `Delete one ${modelName}`,
    };
  }

  static setOperation(metadata: any, func: Function) {
    /* istanbul ignore else */
    if (swaggerConst) {
      R.set(swaggerConst.DECORATORS.API_OPERATION, metadata, func);
    }
  }

  static setParams(metadata: any, func: Function) {
    /* istanbul ignore else */
    if (swaggerConst) {
      R.set(swaggerConst.DECORATORS.API_PARAMETERS, metadata, func);
    }
  }

  static setResponseOk(metadata: any, func: Function) {
    /* istanbul ignore else */
    if (swaggerConst) {
      R.set(swaggerConst.DECORATORS.API_RESPONSE, metadata, func);
    }
  }

  static getOperation(func: Function): any {
    /* istanbul ignore next */
    return swaggerConst ? R.get(swaggerConst.DECORATORS.API_OPERATION, func) || {} : {};
  }

  static getParams(func: Function): any[] {
    /* istanbul ignore next */
    return swaggerConst ? R.get(swaggerConst.DECORATORS.API_PARAMETERS, func) || [] : [];
  }

  static getResponseOk(func: Function): any {
    /* istanbul ignore next */
    return swaggerConst ? R.get(swaggerConst.DECORATORS.API_RESPONSE, func) || {} : {};
  }

  static createResponseOkMeta(status: HttpStatus, isArray: boolean, dto: any): any {
    return swaggerConst
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
    return swaggerConst
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
    if (!swaggerConst) {
      return [];
    }

    const {
      delim: d,
      delimStr: coma,
      fields,
      search,
      filter,
      or,
      join,
      sort,
      limit,
      offset,
      page,
      cache,
    } = Swagger.getQueryParamsNames();
    const oldVersion = Swagger.getSwaggerVersion() < 4;
    const docsLink = (a: string) =>
      `<a href="https://github.com/nestjsx/crud/wiki/Requests#${a}" target="_blank">Docs</a>`;

    const fieldsMetaBase = {
      name: fields,
      description: `Selects resource fields. ${docsLink('select')}`,
      required: false,
      in: 'query',
    };
    const fieldsMeta = oldVersion
      ? {
          ...fieldsMetaBase,
          type: 'array',
          items: {
            type: 'string',
          },
          collectionFormat: 'csv',
        }
      : {
          ...fieldsMetaBase,
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          style: 'form',
          explode: false,
        };

    const searchMetaBase = {
      name: search,
      description: `Adds search condition. ${docsLink('search')}`,
      required: false,
      in: 'query',
    };
    const searchMeta = oldVersion
      ? { ...searchMetaBase, type: 'string' }
      : { ...searchMetaBase, schema: { type: 'string' } };

    const filterMetaBase = {
      name: filter,
      description: `Adds filter condition. ${docsLink('filter')}`,
      required: false,
      in: 'query',
    };
    const filterMeta = oldVersion
      ? {
          ...filterMetaBase,
          items: {
            type: 'string',
          },
          collectionFormat: 'multi',
        }
      : {
          ...filterMetaBase,
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          style: 'form',
          explode: true,
        };

    const orMetaBase = {
      name: or,
      description: `Adds OR condition. ${docsLink('or')}`,
      required: false,
      in: 'query',
    };
    const orMeta = oldVersion
      ? {
          ...orMetaBase,
          items: {
            type: 'string',
          },
          collectionFormat: 'multi',
        }
      : {
          ...orMetaBase,
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          style: 'form',
          explode: true,
        };

    const sortMetaBase = {
      name: sort,
      description: `Adds sort by field. ${docsLink('sort')}`,
      required: false,
      in: 'query',
    };
    const sortMeta = oldVersion
      ? {
          ...sortMetaBase,
          items: {
            type: 'string',
          },
          collectionFormat: 'multi',
        }
      : {
          ...sortMetaBase,
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          style: 'form',
          explode: true,
        };

    const joinMetaBase = {
      name: join,
      description: `Adds relational resources. ${docsLink('join')}`,
      required: false,
      in: 'query',
    };
    const joinMeta = oldVersion
      ? {
          ...joinMetaBase,
          items: {
            type: 'string',
          },
          collectionFormat: 'multi',
        }
      : {
          ...joinMetaBase,
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          style: 'form',
          explode: true,
        };

    const limitMetaBase = {
      name: limit,
      description: `Limit amount of resources. ${docsLink('limit')}`,
      required: false,
      in: 'query',
    };
    const limitMeta = oldVersion
      ? { ...limitMetaBase, type: 'integer' }
      : { ...limitMetaBase, schema: { type: 'integer' } };

    const offsetMetaBase = {
      name: offset,
      description: `Offset amount of resources. ${docsLink('offset')}`,
      required: false,
      in: 'query',
    };
    const offsetMeta = oldVersion
      ? { ...offsetMetaBase, type: 'integer' }
      : { ...offsetMetaBase, schema: { type: 'integer' } };

    const pageMetaBase = {
      name: page,
      description: `Page portion of resources. ${docsLink('page')}`,
      required: false,
      in: 'query',
    };
    const pageMeta = oldVersion
      ? { ...pageMetaBase, type: 'integer' }
      : { ...pageMetaBase, schema: { type: 'integer' } };

    const cacheMetaBase = {
      name: cache,
      description: `Reset cache (if was enabled). ${docsLink('cache')}`,
      required: false,
      in: 'query',
    };
    const cacheMeta = oldVersion
      ? { ...cacheMetaBase, type: 'integer', minimum: 0, maximum: 1 }
      : { ...cacheMetaBase, schema: { type: 'integer', minimum: 0, maximum: 1 } };

    switch (name) {
      case 'getManyBase':
        return [
          fieldsMeta,
          searchMeta,
          filterMeta,
          orMeta,
          sortMeta,
          joinMeta,
          limitMeta,
          offsetMeta,
          pageMeta,
          cacheMeta,
        ];
      case 'getOneBase':
        return [fieldsMeta, joinMeta, cacheMeta];
      default:
        return [];
    }
  }

  static getQueryParamsNames() {
    const qbOptions = RequestQueryBuilder.getOptions();
    const name = (n) => {
      const selected = qbOptions.paramNamesMap[n];
      return isString(selected) ? selected : selected[0];
    };

    return {
      delim: qbOptions.delim,
      delimStr: qbOptions.delimStr,
      fields: name('fields'),
      search: name('search'),
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

  private static getSwaggerVersion(): number {
    return swaggerPkgJson ? parseInt(swaggerPkgJson.version[0], 10) : 3;
  }
}

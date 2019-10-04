import { HttpStatus } from '@nestjs/common';
import { objKeys, isString } from '@nestjsx/util';
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
      replaceOneBase: `Replace one ${modelName}`,
      deleteOneBase: `Delete one ${modelName}`,
    };
  }

  static setOperation(metadata: any, func: Function) {
    /* istanbul ignore else */
    if (swaggerPkg) {
      R.set(swaggerPkg.DECORATORS.API_OPERATION, metadata, func);
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
      delim: d,
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

    const fieldsMeta = {
      name: fields,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?${fields}=field1${coma}field2${coma}...</strong> <br/><i>Example:</i> <strong>?${fields}=email${coma}name</strong>`,
      required: false,
      in: 'query',
      type: 'array',
      items: {
        type: 'string',
      },
      collectionFormat: 'csv',
    };
    const filterMeta = {
      name: filter,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Adds fields request condition (multiple conditions) to the request.</h4><i>Syntax:</i> <strong>?${filter}=field${d}condition${d}value</strong><br/><i>Examples:</i> <ul><li><strong>?${filter}=name${d}eq${d}batman</strong></li><li><strong>?${filter}=isVillain${d}eq${d}false&${filter}=city${d}eq${d}Arkham</strong> (multiple filters are treated as a combination of AND type of conditions)</li><li><strong>?${filter}=shots${d}in${d}12${coma}26</strong> (some conditions accept multiple values separated by commas)</li><li><strong>?${filter}=power${d}isnull</strong> (some conditions don't accept value)</li></ul><br/>Filter Conditions:<ul><li><strong><code>eq</code></strong> (<code>=</code>, equal)</li><li><strong><code>ne</code></strong> (<code>!=</code>, not equal)</li><li><strong><code>gt</code></strong> (<code>&gt;</code>, greater than)</li><li><strong><code>lt</code></strong> (<code>&lt;</code>, lower that)</li><li><strong><code>gte</code></strong> (<code>&gt;=</code>, greater than or equal)</li><li><strong><code>lte</code></strong> (<code>&lt;=</code>, lower than or equal)</li><li><strong><code>starts</code></strong> (<code>LIKE val%</code>, starts with)</li><li><strong><code>ends</code></strong> (<code>LIKE %val</code>, ends with)</li><li><strong><code>cont</code></strong> (<code>LIKE %val%</code>, contains)</li><li><strong><code>excl</code></strong> (<code>NOT LIKE %val%</code>, not contains)</li><li><strong><code>in</code></strong> (<code>IN</code>, in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>notin</code></strong> (<code>NOT IN</code>, not in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>isnull</code></strong> (<code>IS NULL</code>, is NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>notnull</code></strong> (<code>IS NOT NULL</code>, not NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>between</code></strong> (<code>BETWEEN</code>, between, <strong><em>accepts two values</em></strong>)</li></ul>`,
      required: false,
      in: 'query',
      type: 'array',
      items: {
        type: 'string',
      },
      collectionFormat: 'multi',
    };
    const orMeta = {
      name: or,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Adds <code>OR</code> conditions to the request.</h4><i>Syntax:</i> <strong>?${or}=field${d}condition${d}value</strong><br/>It uses the same conditions as the filter parameter<br/><i>Rules and <i>Examples:</i></i><ul><li>If there is only <strong>one</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as simple filter:</li><ul><li><strong>?${or}=name${d}eq${d}batman</strong></li></ul></ul><ul><li>If there are <strong>multiple</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as a compination of <code>OR</code> conditions, as follows:<br><code>WHERE {or} OR {or} OR ...</code></li><ul><li><strong>?${or}=name${d}eq${d}batman&${or}=name${d}eq${d}joker</strong></li></ul></ul><ul><li>If there are <strong>one</strong> <code>or</code> and <strong>one</strong> <code>filter</code> then it will be interpreted as <code>OR</code> condition, as follows:<br><code>WHERE {filter} OR {or}</code></li><ul><li><strong>?${filter}=name${d}eq${d}batman&${or}=name${d}eq${d}joker</strong></li></ul></ul><ul><li>If present <strong>both</strong> <code>or</code> and <code>filter</code> in any amount (<strong>one</strong> or <strong>miltiple</strong> each) then both interpreted as a combitation of <code>AND</code> conditions and compared with each other by <code>OR</code> condition, as follows:<br><code>WHERE ({filter} AND {filter} AND ...) OR ({or} AND {or} AND ...)</code></li><ul><li><strong>?${filter}=type${d}eq${d}hero&${filter}=status${d}eq${d}alive&${or}=type${d}eq${d}villain&${or}=status${d}eq${d}dead</strong></li></ul></ul>`,
      required: false,
      in: 'query',
      type: 'array',
      items: {
        type: 'string',
      },
      collectionFormat: 'multi',
    };
    const sortMeta = {
      name: sort,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Adds sort by field (by multiple fields) and order to query result.</h4><i>Syntax:</i> <strong>?${sort}=field${coma}ASC|DESC</strong><br/><i>Examples:</i></i><ul><li><strong>?${sort}=name${coma}ASC</strong></li><li><strong>?${sort}=name${coma}ASC&${sort}=id${coma}DESC</strong></li></ul>`,
      required: false,
      in: 'query',
      type: 'array',
      items: {
        type: 'string',
      },
      collectionFormat: 'multi',
    };
    const joinMeta = {
      name: join,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Receive joined relational objects in GET result (with all or selected fields).</h4><i>Syntax:</i><ul><li><strong>?${join}=relation</strong></li><li><strong>?${join}=relation${d}field1${coma}field2${coma}...</strong></li><li><strong>?${join}=relation1${d}field11${coma}field12${coma}...&${join}=relation1.nested${d}field21${coma}field22${coma}...&${join}=...</strong></li></ul><br/><i>Examples:</i></i><ul><li><strong>?${join}=profile</strong></li><li><strong>?${join}=profile${d}firstName${coma}email</strong></li><li><strong>?${join}=profile${d}firstName${coma}email&${join}=notifications${d}content&${join}=tasks</strong></li><li><strong>?${join}=relation1&${join}=relation1.nested&${join}=relation1.nested.deepnested</strong></li></ul><strong><i>Notice:</i></strong> <code>id</code> field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.`,
      required: false,
      in: 'query',
      type: 'array',
      items: {
        type: 'string',
      },
      collectionFormat: 'multi',
    };
    const limitMeta = {
      name: limit,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Receive <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?${limit}=number</strong><br/><i>Example:</i> <strong>?${limit}=10</strong>`,
      required: false,
      in: 'query',
      type: 'integer',
    };
    const offsetMeta = {
      name: offset,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Offset <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?${offset}=number</strong><br/><i>Example:</i> <strong>?${offset}=10</strong>`,
      required: false,
      in: 'query',
      type: 'integer',
    };
    const pageMeta = {
      name: page,
      // tslint:disable-next-line:max-line-length
      description: `<h4>Receive a portion of <code>limit</code> entities (alternative to <code>offset</code>). Will be applied if <code>limit</code> is set up.</h4><i>Syntax:</i> <strong>?${page}=number</strong><br/><i>Example:</i> <strong>?${page}=2</strong>`,
      required: false,
      in: 'query',
      type: 'integer',
    };
    const cacheMeta = {
      name: cache,
      description: `<h4>Reset cache (if was enabled) and receive entities from the DB.</h4><i>Usage:</i> <strong>?${cache}=0</strong>`,
      required: false,
      in: 'query',
      type: 'integer',
      minimum: 0,
      maximum: 1,
    };

    switch (name) {
      case 'getManyBase':
        return [
          fieldsMeta,
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

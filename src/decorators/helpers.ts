import { RequestMethod, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { isNil, isObject } from '@nestjs/common/utils/shared.utils';
import {
  PATH_METADATA,
  METHOD_METADATA,
  INTERCEPTORS_METADATA,
  ROUTE_ARGS_METADATA,
  PARAMTYPES_METADATA,
  CUSTOM_ROUTE_AGRS_METADATA,
} from '@nestjs/common/constants';

import { CrudActions, CrudValidate } from '../enums';
import { CrudOptions, RoutesOptions } from '../interfaces';
import { BaseRouteName } from '../types';
import { ACTION_NAME_METADATA, OVERRIDE_METHOD_METADATA } from '../constants';
import { swagger, hasValidator, hasTypeorm } from '../utils';

export function setRoute(path: string, method: RequestMethod, func: Function) {
  Reflect.defineMetadata(PATH_METADATA, path, func);
  Reflect.defineMetadata(METHOD_METADATA, method, func);
}

export function setParamTypes(args: any[], prototype: any, name: string) {
  Reflect.defineMetadata(PARAMTYPES_METADATA, args, prototype, name);
}

export function setParams(metadata: any, target: object, name: string) {
  Reflect.defineMetadata(ROUTE_ARGS_METADATA, metadata, target, name);
}

export function setInterceptors(interceptors: any[], func: Function) {
  Reflect.defineMetadata(INTERCEPTORS_METADATA, interceptors, func);
}

export function setAction(action: CrudActions, func: Function) {
  Reflect.defineMetadata(ACTION_NAME_METADATA, action, func);
}

export function setSwaggerOkResponseMeta(meta: any, func: Function) {
  if (swagger) {
    Reflect.defineMetadata(swagger.DECORATORS.API_RESPONSE, meta, func);
  }
}

export function setSwaggerOperationMeta(meta: any, func: Function) {
  if (swagger) {
    Reflect.defineMetadata(swagger.DECORATORS.API_OPERATION, meta, func);
  }
}

export function setSwaggerParamsMeta(meta: any, func: Function) {
  if (swagger) {
    Reflect.defineMetadata(swagger.DECORATORS.API_PARAMETERS, meta, func);
  }
}

export function setSwaggerOkResponse(func: Function, dto: any, isArray?: boolean) {
  if (swagger) {
    const metadata = getSwaggeOkResponse(func);

    const groupedMetadata = {
      [200]: {
        type: dto,
        isArray,
        description: '',
      },
    };

    setSwaggerOkResponseMeta({ ...metadata, ...groupedMetadata }, func);
  }
}

export function setSwaggerOperation(func: Function, summary: string = '') {
  if (swagger) {
    const metadata = getSwaggerOperation(func);

    setSwaggerOperationMeta(Object.assign(metadata, { summary }), func);
  }
}

export function setSwaggerParams(func: Function, crudOptions: CrudOptions) {
  if (swagger) {
    const metadata = getSwaggerParams(func);

    const params = Object.keys(crudOptions.params).map((key) => ({
      name: key,
      required: true,
      in: 'path',
      type: crudOptions.params[key] === 'number' ? Number : String,
    }));

    setSwaggerParamsMeta([...metadata, ...params], func);
  }
}

export function setSwaggerQueryGetOne(func: Function) {
  if (swagger) {
    const metadata = getSwaggerParams(func);

    const params = [
      {
        name: 'fields',
        description: `<h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?fields=field1,field2,...</strong> <br/><i>Example:</i> <strong>?fields=email,name</strong>`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'join',
        description: `<h4>Receive joined relational objects in GET result (with all or selected fields).</h4><i>Syntax:</i><ul><li><strong>?join=relation</strong></li><li><strong>?join=relation||field1,field2,...</strong></li><li><strong>?join=relation1||field11,field12,...&join=relation1.nested||field21,field22,...&join=...</strong></li></ul><br/><i>Examples:</i></i><ul><li><strong>?join=profile</strong></li><li><strong>?join=profile||firstName,email</strong></li><li><strong>?join=profile||firstName,email&join=notifications||content&join=tasks</strong></li><li><strong>?join=relation1&join=relation1.nested&join=relation1.nested.deepnested</strong></li></ul><strong><i>Notice:</i></strong> <code>id</code> field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'cache',
        description: `<h4>Reset cache (if was enabled) and receive entities from the DB.</h4><i>Usage:</i> <strong>?cache=0</strong>`,
        required: false,
        in: 'query',
        type: Number,
      },
    ];

    setSwaggerParamsMeta([...metadata, ...params], func);
  }
}

export function setSwaggerQueryGetMany(func: Function, name: string) {
  if (swagger) {
    const metadata = getSwaggerParams(func);

    const params = [
      {
        name: 'fields',
        description: `<h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?fields=field1,field2,...</strong> <br/><i>Example:</i> <strong>?fields=email,name</strong>`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'filter',
        description: `<h4>Adds fields request condition (multiple conditions) to the request.</h4><i>Syntax:</i> <strong>?filter=field||condition||value</strong><br/><i>Examples:</i> <ul><li><strong>?filter=name||eq||batman</strong></li><li><strong>?filter=isVillain||eq||false&filter=city||eq||Arkham</strong> (multiple filters are treated as a combination of AND type of conditions)</li><li><strong>?filter=shots||in||12,26</strong> (some conditions accept multiple values separated by commas)</li><li><strong>?filter=power||isnull</strong> (some conditions don't accept value)</li></ul><br/>Filter Conditions:<ul><li><strong><code>eq</code></strong> (<code>=</code>, equal)</li><li><strong><code>ne</code></strong> (<code>!=</code>, not equal)</li><li><strong><code>gt</code></strong> (<code>&gt;</code>, greater than)</li><li><strong><code>lt</code></strong> (<code>&lt;</code>, lower that)</li><li><strong><code>gte</code></strong> (<code>&gt;=</code>, greater than or equal)</li><li><strong><code>lte</code></strong> (<code>&lt;=</code>, lower than or equal)</li><li><strong><code>starts</code></strong> (<code>LIKE val%</code>, starts with)</li><li><strong><code>ends</code></strong> (<code>LIKE %val</code>, ends with)</li><li><strong><code>cont</code></strong> (<code>LIKE %val%</code>, contains)</li><li><strong><code>excl</code></strong> (<code>NOT LIKE %val%</code>, not contains)</li><li><strong><code>in</code></strong> (<code>IN</code>, in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>notin</code></strong> (<code>NOT IN</code>, not in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>isnull</code></strong> (<code>IS NULL</code>, is NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>notnull</code></strong> (<code>IS NOT NULL</code>, not NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>between</code></strong> (<code>BETWEEN</code>, between, <strong><em>accepts two values</em></strong>)</li></ul>`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'or',
        description: `<h4>Adds <code>OR</code> conditions to the request.</h4><i>Syntax:</i> <strong>?or=field||condition||value</strong><br/>It uses the same conditions as the filter parameter<br/><i>Rules and <i>Examples:</i></i><ul><li>If there is only <strong>one</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as simple filter:</li><ul><li><strong>?or=name||eq||batman</strong></li></ul></ul><ul><li>If there are <strong>multiple</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as a compination of <code>OR</code> conditions, as follows:<br><code>WHERE {or} OR {or} OR ...</code></li><ul><li><strong>?or=name||eq||batman&or=name||eq||joker</strong></li></ul></ul><ul><li>If there are <strong>one</strong> <code>or</code> and <strong>one</strong> <code>filter</code> then it will be interpreted as <code>OR</code> condition, as follows:<br><code>WHERE {filter} OR {or}</code></li><ul><li><strong>?filter=name||eq||batman&or=name||eq||joker</strong></li></ul></ul><ul><li>If present <strong>both</strong> <code>or</code> and <code>filter</code> in any amount (<strong>one</strong> or <strong>miltiple</strong> each) then both interpreted as a combitation of <code>AND</code> conditions and compared with each other by <code>OR</code> condition, as follows:<br><code>WHERE ({filter} AND {filter} AND ...) OR ({or} AND {or} AND ...)</code></li><ul><li><strong>?filter=type||eq||hero&filter=status||eq||alive&or=type||eq||villain&or=status||eq||dead</strong></li></ul></ul>`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'sort',
        description: `<h4>Adds sort by field (by multiple fields) and order to query result.</h4><i>Syntax:</i> <strong>?sort=field,ASC|DESC</strong><br/><i>Examples:</i></i><ul><li><strong>?sort=name,ASC</strong></li><li><strong>?sort=name,ASC&sort=id,DESC</strong></li></ul>`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'join',
        description: `<h4>Receive joined relational objects in GET result (with all or selected fields).</h4><i>Syntax:</i><ul><li><strong>?join=relation</strong></li><li><strong>?join=relation||field1,field2,...</strong></li><li><strong>?join=relation1||field11,field12,...&join=relation1.nested||field21,field22,...&join=...</strong></li></ul><br/><i>Examples:</i></i><ul><li><strong>?join=profile</strong></li><li><strong>?join=profile||firstName,email</strong></li><li><strong>?join=profile||firstName,email&join=notifications||content&join=tasks</strong></li><li><strong>?join=relation1&join=relation1.nested&join=relation1.nested.deepnested</strong></li></ul><strong><i>Notice:</i></strong> <code>id</code> field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.`,
        required: false,
        in: 'query',
        type: String,
      },
      {
        name: 'limit',
        description: `<h4>Receive <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?limit=number</strong><br/><i>Example:</i> <strong>?limit=10</strong>`,
        required: false,
        in: 'query',
        type: Number,
      },
      {
        name: 'offset',
        description: `<h4>Offset <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?offset=number</strong><br/><i>Example:</i> <strong>?offset=10</strong>`,
        required: false,
        in: 'query',
        type: Number,
      },
      {
        name: 'page',
        description: `<h4>Receive a portion of <code>limit</code> (per_page) entities (alternative to <code>offset</code>). Will be applied if <code>limit</code> is set up.</h4><i>Syntax:</i> <strong>?page=number</strong><br/><i>Example:</i> <strong>?page=2</strong>`,
        required: false,
        in: 'query',
        type: Number,
      },
      {
        name: 'per_page',
        description: `Alias for limit`,
        required: false,
        in: 'query',
        type: Number,
      },
      {
        name: 'cache',
        description: `<h4>Reset cache (if was enabled) and receive entities from the DB.</h4><i>Usage:</i> <strong>?cache=0</strong>`,
        required: false,
        in: 'query',
        type: Number,
      },
    ];

    setSwaggerParamsMeta([...metadata, ...params], func);
  }
}

export function createParamMetadata(
  paramtype: RouteParamtypes,
  index: number,
  pipes: any[] = [],
  data = undefined,
): any {
  return {
    [`${paramtype}:${index}`]: {
      index,
      pipes,
      data,
    },
  };
}

export function createCustomRequestParamMetadata(
  paramtype: string,
  index: number,
  pipes: any[] = [],
  data = undefined,
): any {
  return {
    [`${paramtype}${CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
      index,
      factory: (data, req) => req[paramtype],
      data,
      pipes,
    },
  };
}

export function getOverrideMetadata(func: Function): string {
  return Reflect.getMetadata(OVERRIDE_METHOD_METADATA, func);
}

export function getInterceptors(func: Function): any[] {
  return Reflect.getMetadata(INTERCEPTORS_METADATA, func);
}

export function getAction(func: Function): CrudActions {
  return Reflect.getMetadata(ACTION_NAME_METADATA, func);
}

export function getControllerPath(target): string {
  return Reflect.getMetadata(PATH_METADATA, target);
}

export function getSwaggerParams(func: Function): any[] {
  if (swagger) {
    return Reflect.getMetadata(swagger.DECORATORS.API_PARAMETERS, func) || [];
  }
}

export function getSwaggeOkResponse(func: Function): any {
  if (swagger) {
    return Reflect.getMetadata(swagger.DECORATORS.API_RESPONSE, func) || {};
  }
}

export function getSwaggerOperation(func: Function): any {
  if (swagger) {
    return Reflect.getMetadata(swagger.DECORATORS.API_OPERATION, func) || {};
  }
}

export function setValidationPipe(crudOptions: CrudOptions, group: CrudValidate) {
  const options = crudOptions.validation || {};

  return hasValidator
    ? new ValidationPipe({
        ...options,
        groups: [group],
        transform: false,
      })
    : undefined;
}

export function enableRoute(name: BaseRouteName, crudOptions: CrudOptions) {
  if (crudOptions.routes.only && crudOptions.routes.only.length) {
    return crudOptions.routes.only.some((only) => only === name);
  }

  if (crudOptions.routes.exclude && crudOptions.routes.exclude.length) {
    return !crudOptions.routes.exclude.some((exclude) => exclude === name);
  }

  return true;
}

export function paramsOptionsInit(crudOptions: CrudOptions) {
  const check = (obj) => isNil(obj) || !isObject(obj) || !Object.keys(obj).length;

  // set default `id` numeric slug
  if (check(crudOptions.params)) {
    crudOptions.params = { id: 'number' };
  }

  // set default routes options
  if (check(crudOptions.routes)) {
    crudOptions.routes = {};
  }

  if (check(crudOptions.routes.getManyBase)) {
    crudOptions.routes.getManyBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.getOneBase)) {
    crudOptions.routes.getOneBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.createOneBase)) {
    crudOptions.routes.createOneBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.createManyBase)) {
    crudOptions.routes.createManyBase = { interceptors: [] };
  }

  if (check(crudOptions.routes.updateOneBase)) {
    crudOptions.routes.updateOneBase = { allowParamsOverride: false, interceptors: [] };
  }

  if (check(crudOptions.routes.deleteOneBase)) {
    crudOptions.routes.deleteOneBase = { returnDeleted: false, interceptors: [] };
  }
}

export function getRoutesSlugName(crudOptions: CrudOptions, path: string): string {
  if (!isNil(crudOptions.params.id)) {
    return 'id';
  }

  return Object.keys(crudOptions.params).filter((slug) => !path.includes(`:${slug}`))[0] || 'id';
}

export function getRouteInterceptors(routeOptions: any): any[] {
  return Array.isArray(routeOptions.interceptors) ? routeOptions.interceptors : [];
}

export function cleanRoutesOptionsInterceptors(crudOptions: CrudOptions) {
  Object.keys(<RoutesOptions>crudOptions.routes).forEach((option) => {
    if (option !== 'exclude' && option !== 'only') {
      crudOptions.routes[option].interceptors = [];
    }
  });
}

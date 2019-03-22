"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("@nestjs/common/constants");
const constants_2 = require("../constants");
const utils_1 = require("../utils");
function setRoute(path, method, func) {
    Reflect.defineMetadata(constants_1.PATH_METADATA, path, func);
    Reflect.defineMetadata(constants_1.METHOD_METADATA, method, func);
}
exports.setRoute = setRoute;
function setParamTypes(args, prototype, name) {
    Reflect.defineMetadata(constants_1.PARAMTYPES_METADATA, args, prototype, name);
}
exports.setParamTypes = setParamTypes;
function setParams(metadata, target, name) {
    Reflect.defineMetadata(constants_1.ROUTE_ARGS_METADATA, metadata, target, name);
}
exports.setParams = setParams;
function setInterceptors(interceptors, func) {
    Reflect.defineMetadata(constants_1.INTERCEPTORS_METADATA, interceptors, func);
}
exports.setInterceptors = setInterceptors;
function setAction(action, func) {
    Reflect.defineMetadata(constants_2.ACTION_NAME_METADATA, action, func);
}
exports.setAction = setAction;
function setSwaggerOkResponseMeta(meta, func) {
    if (utils_1.swagger) {
        Reflect.defineMetadata(utils_1.swagger.DECORATORS.API_RESPONSE, meta, func);
    }
}
exports.setSwaggerOkResponseMeta = setSwaggerOkResponseMeta;
function setSwaggerOperationMeta(meta, func) {
    if (utils_1.swagger) {
        Reflect.defineMetadata(utils_1.swagger.DECORATORS.API_OPERATION, meta, func);
    }
}
exports.setSwaggerOperationMeta = setSwaggerOperationMeta;
function setSwaggerParamsMeta(meta, func) {
    if (utils_1.swagger) {
        Reflect.defineMetadata(utils_1.swagger.DECORATORS.API_PARAMETERS, meta, func);
    }
}
exports.setSwaggerParamsMeta = setSwaggerParamsMeta;
function setSwaggerOkResponse(func, dto, isArray) {
    if (utils_1.swagger) {
        const metadata = getSwaggeOkResponse(func);
        const groupedMetadata = {
            [200]: {
                type: dto,
                isArray,
                description: '',
            },
        };
        setSwaggerOkResponseMeta(Object.assign({}, metadata, groupedMetadata), func);
    }
}
exports.setSwaggerOkResponse = setSwaggerOkResponse;
function setSwaggerOperation(func, summary = '') {
    if (utils_1.swagger) {
        const metadata = getSwaggerOperation(func);
        setSwaggerOperationMeta(Object.assign(metadata, { summary }), func);
    }
}
exports.setSwaggerOperation = setSwaggerOperation;
function setSwaggerParams(func, crudOptions) {
    if (utils_1.swagger) {
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
exports.setSwaggerParams = setSwaggerParams;
function setSwaggerQueryGetOne(func) {
    if (utils_1.swagger) {
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
exports.setSwaggerQueryGetOne = setSwaggerQueryGetOne;
function setSwaggerQueryGetMany(func, name) {
    if (utils_1.swagger) {
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
exports.setSwaggerQueryGetMany = setSwaggerQueryGetMany;
function createParamMetadata(paramtype, index, pipes = [], data = undefined) {
    return {
        [`${paramtype}:${index}`]: {
            index,
            pipes,
            data,
        },
    };
}
exports.createParamMetadata = createParamMetadata;
function createCustomRequestParamMetadata(paramtype, index, pipes = [], data = undefined) {
    return {
        [`${paramtype}${constants_1.CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
            index,
            factory: (data, req) => req[paramtype],
            data,
            pipes,
        },
    };
}
exports.createCustomRequestParamMetadata = createCustomRequestParamMetadata;
function getOverrideMetadata(func) {
    return Reflect.getMetadata(constants_2.OVERRIDE_METHOD_METADATA, func);
}
exports.getOverrideMetadata = getOverrideMetadata;
function getInterceptors(func) {
    return Reflect.getMetadata(constants_1.INTERCEPTORS_METADATA, func);
}
exports.getInterceptors = getInterceptors;
function getAction(func) {
    return Reflect.getMetadata(constants_2.ACTION_NAME_METADATA, func);
}
exports.getAction = getAction;
function getControllerPath(target) {
    return Reflect.getMetadata(constants_1.PATH_METADATA, target);
}
exports.getControllerPath = getControllerPath;
function getSwaggerParams(func) {
    if (utils_1.swagger) {
        return Reflect.getMetadata(utils_1.swagger.DECORATORS.API_PARAMETERS, func) || [];
    }
}
exports.getSwaggerParams = getSwaggerParams;
function getSwaggeOkResponse(func) {
    if (utils_1.swagger) {
        return Reflect.getMetadata(utils_1.swagger.DECORATORS.API_RESPONSE, func) || {};
    }
}
exports.getSwaggeOkResponse = getSwaggeOkResponse;
function getSwaggerOperation(func) {
    if (utils_1.swagger) {
        return Reflect.getMetadata(utils_1.swagger.DECORATORS.API_OPERATION, func) || {};
    }
}
exports.getSwaggerOperation = getSwaggerOperation;
function setValidationPipe(crudOptions, group) {
    const options = crudOptions.validation || {};
    return utils_1.hasValidator
        ? new common_1.ValidationPipe(Object.assign({}, options, { groups: [group], transform: false }))
        : undefined;
}
exports.setValidationPipe = setValidationPipe;
function enableRoute(name, crudOptions) {
    if (crudOptions.routes.only && crudOptions.routes.only.length) {
        return crudOptions.routes.only.some((only) => only === name);
    }
    if (crudOptions.routes.exclude && crudOptions.routes.exclude.length) {
        return !crudOptions.routes.exclude.some((exclude) => exclude === name);
    }
    return true;
}
exports.enableRoute = enableRoute;
function paramsOptionsInit(crudOptions) {
    const check = (obj) => shared_utils_1.isNil(obj) || !shared_utils_1.isObject(obj) || !Object.keys(obj).length;
    if (check(crudOptions.params)) {
        crudOptions.params = { id: 'number' };
    }
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
exports.paramsOptionsInit = paramsOptionsInit;
function getRoutesSlugName(crudOptions, path) {
    if (!shared_utils_1.isNil(crudOptions.params.id)) {
        return 'id';
    }
    return Object.keys(crudOptions.params).filter((slug) => !path.includes(`:${slug}`))[0] || 'id';
}
exports.getRoutesSlugName = getRoutesSlugName;
function getRouteInterceptors(routeOptions) {
    return Array.isArray(routeOptions.interceptors) ? routeOptions.interceptors : [];
}
exports.getRouteInterceptors = getRouteInterceptors;
function cleanRoutesOptionsInterceptors(crudOptions) {
    Object.keys(crudOptions.routes).forEach((option) => {
        if (option !== 'exclude' && option !== 'only') {
            crudOptions.routes[option].interceptors = [];
        }
    });
}
exports.cleanRoutesOptionsInterceptors = cleanRoutesOptionsInterceptors;
//# sourceMappingURL=helpers.js.map
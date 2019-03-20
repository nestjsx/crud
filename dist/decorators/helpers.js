"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
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
function setSwaggerParams(func, crudOptions) {
    if (utils_1.swagger) {
        const params = Object.keys(crudOptions.params).map((key) => ({
            name: key,
            required: true,
            in: 'path',
            type: crudOptions.params[key] === 'number' ? Number : String,
        }));
        setSwagger(params, func);
    }
}
exports.setSwaggerParams = setSwaggerParams;
function setSwaggerQueryGetOne(func, name) {
    if (utils_1.swagger) {
        const params = [
            {
                name: 'fields',
                description: `${name} fields`,
                required: false,
                in: 'query',
                type: String,
            },
            {
                name: 'join',
                description: `Join relational entity with ${name}`,
                required: false,
                in: 'query',
                type: String,
            },
            {
                name: 'cache',
                description: `Reset cached result`,
                required: false,
                in: 'query',
                type: Number,
            },
        ];
        setSwagger(params, func);
    }
}
exports.setSwaggerQueryGetOne = setSwaggerQueryGetOne;
function setSwaggerQueryGetMany(func, name) {
    if (utils_1.swagger) {
        const params = [
            {
                name: 'fields',
                description: `${name} fields in the collection`,
                required: false,
                in: 'query',
                type: String,
            },
            {
                name: 'filter',
                description: `Filter ${name} collection with condition`,
                required: false,
                in: 'query',
                type: String,
            },
            {
                name: 'or',
                description: `Filter ${name} collection with condition (OR)`,
                required: false,
                in: 'query',
                type: String,
            },
            {
                name: 'sort',
                description: `Sort ${name} collection by field and order`,
                required: false,
                in: 'query',
                type: String,
            },
            {
                name: 'join',
                description: `Join relational entity with ${name}`,
                required: false,
                in: 'query',
                type: String,
            },
            {
                name: 'limit',
                description: `Limit ${name} collection`,
                required: false,
                in: 'query',
                type: Number,
            },
            {
                name: 'offset',
                description: `Offset ${name} collection`,
                required: false,
                in: 'query',
                type: Number,
            },
            {
                name: 'page',
                description: `Set page of ${name} collection`,
                required: false,
                in: 'query',
                type: Number,
            },
            {
                name: 'cache',
                description: `Reset cached result`,
                required: false,
                in: 'query',
                type: Number,
            },
        ];
        setSwagger(params, func);
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
function setValidationPipe(crudOptions, group) {
    const options = crudOptions.validation || {};
    return utils_1.hasValidator
        ? new common_1.ValidationPipe(Object.assign({}, options, { groups: [group], transform: false }))
        : undefined;
}
exports.setValidationPipe = setValidationPipe;
function setParseIntPipe() {
    return utils_1.hasTypeorm ? new common_1.ParseIntPipe() : undefined;
}
exports.setParseIntPipe = setParseIntPipe;
function enableRoute(name, crudOptions) {
    if (!crudOptions.routes) {
        return true;
    }
    if (crudOptions.routes.only && crudOptions.routes.only.length) {
        return crudOptions.routes.only.some((only) => only === name);
    }
    if (crudOptions.routes.exclude && crudOptions.routes.exclude.length) {
        return !crudOptions.routes.exclude.some((exclude) => exclude === name);
    }
    return true;
}
exports.enableRoute = enableRoute;
function setSwagger(params, func) {
    const metadata = Reflect.getMetadata(utils_1.swagger.DECORATORS.API_PARAMETERS, func) || [];
    Reflect.defineMetadata(utils_1.swagger.DECORATORS.API_PARAMETERS, [...metadata, ...params], func);
}
//# sourceMappingURL=helpers.js.map
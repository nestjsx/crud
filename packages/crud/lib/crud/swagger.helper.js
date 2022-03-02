"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const crud_request_1 = require("@nestjsx/crud-request");
const util_1 = require("@nestjsx/util");
const util_2 = require("../util");
const reflection_helper_1 = require("./reflection.helper");
const pluralize = require('pluralize');
exports.swagger = util_2.safeRequire('@nestjs/swagger', () => require('@nestjs/swagger'));
exports.swaggerConst = util_2.safeRequire('@nestjs/swagger/dist/constants', () => require('@nestjs/swagger/dist/constants'));
exports.swaggerPkgJson = util_2.safeRequire('@nestjs/swagger/package.json', () => require('@nestjs/swagger/package.json'));
class Swagger {
    static operationsMap(modelName) {
        return {
            getManyBase: `Retrieve multiple ${pluralize(modelName)}`,
            getOneBase: `Retrieve a single ${modelName}`,
            createManyBase: `Create multiple ${pluralize(modelName)}`,
            createOneBase: `Create a single ${modelName}`,
            updateOneBase: `Update a single ${modelName}`,
            replaceOneBase: `Replace a single ${modelName}`,
            deleteOneBase: `Delete a single ${modelName}`,
            recoverOneBase: `Recover one ${modelName}`,
        };
    }
    static setOperation(metadata, func) {
        if (exports.swaggerConst) {
            reflection_helper_1.R.set(exports.swaggerConst.DECORATORS.API_OPERATION, metadata, func);
        }
    }
    static setParams(metadata, func) {
        if (exports.swaggerConst) {
            reflection_helper_1.R.set(exports.swaggerConst.DECORATORS.API_PARAMETERS, metadata, func);
        }
    }
    static setExtraModels(swaggerModels) {
        if (exports.swaggerConst) {
            const meta = Swagger.getExtraModels(swaggerModels.get);
            const models = [
                ...meta,
                ...util_1.objKeys(swaggerModels)
                    .map((name) => swaggerModels[name])
                    .filter((one) => one && one.name !== swaggerModels.get.name),
            ];
            reflection_helper_1.R.set(exports.swaggerConst.DECORATORS.API_EXTRA_MODELS, models, swaggerModels.get);
        }
    }
    static setResponseOk(metadata, func) {
        if (exports.swaggerConst) {
            reflection_helper_1.R.set(exports.swaggerConst.DECORATORS.API_RESPONSE, metadata, func);
        }
    }
    static getOperation(func) {
        return exports.swaggerConst ? reflection_helper_1.R.get(exports.swaggerConst.DECORATORS.API_OPERATION, func) || {} : {};
    }
    static getParams(func) {
        return exports.swaggerConst ? reflection_helper_1.R.get(exports.swaggerConst.DECORATORS.API_PARAMETERS, func) || [] : [];
    }
    static getExtraModels(target) {
        return exports.swaggerConst ? reflection_helper_1.R.get(exports.swaggerConst.API_EXTRA_MODELS, target) || [] : [];
    }
    static getResponseOk(func) {
        return exports.swaggerConst ? reflection_helper_1.R.get(exports.swaggerConst.DECORATORS.API_RESPONSE, func) || {} : {};
    }
    static createResponseMeta(name, options, swaggerModels) {
        if (exports.swagger) {
            const { routes, query } = options;
            const oldVersion = Swagger.getSwaggerVersion() < 4;
            switch (name) {
                case 'getOneBase':
                    return {
                        [common_1.HttpStatus.OK]: {
                            description: 'Get one base response',
                            type: swaggerModels.get,
                        },
                    };
                case 'getManyBase':
                    if (oldVersion) {
                        return {
                            [common_1.HttpStatus.OK]: {
                                type: swaggerModels.getMany,
                            },
                        };
                    }
                    return {
                        [common_1.HttpStatus.OK]: query.alwaysPaginate
                            ? {
                                description: 'Get paginated response',
                                type: swaggerModels.getMany,
                            }
                            : {
                                description: 'Get many base response',
                                schema: {
                                    oneOf: [
                                        { $ref: exports.swagger.getSchemaPath(swaggerModels.getMany.name) },
                                        {
                                            type: 'array',
                                            items: { $ref: exports.swagger.getSchemaPath(swaggerModels.get.name) },
                                        },
                                    ],
                                },
                            },
                    };
                case 'createOneBase':
                    if (oldVersion) {
                        return {
                            [common_1.HttpStatus.OK]: {
                                type: swaggerModels.create,
                            },
                        };
                    }
                    return {
                        [common_1.HttpStatus.CREATED]: {
                            description: 'Get create one base response',
                            schema: { $ref: exports.swagger.getSchemaPath(swaggerModels.create.name) },
                        },
                    };
                case 'createManyBase':
                    if (oldVersion) {
                        return {
                            [common_1.HttpStatus.OK]: {
                                type: swaggerModels.create,
                                isArray: true,
                            },
                        };
                    }
                    return {
                        [common_1.HttpStatus.CREATED]: swaggerModels.createMany
                            ? {
                                description: 'Get create many base response',
                                schema: { $ref: exports.swagger.getSchemaPath(swaggerModels.createMany.name) },
                            }
                            : {
                                description: 'Get create many base response',
                                schema: {
                                    type: 'array',
                                    items: { $ref: exports.swagger.getSchemaPath(swaggerModels.create.name) },
                                },
                            },
                    };
                case 'deleteOneBase':
                    if (oldVersion) {
                        return {
                            [common_1.HttpStatus.OK]: routes.deleteOneBase.returnDeleted
                                ? {
                                    type: swaggerModels.delete,
                                }
                                : {},
                        };
                    }
                    return {
                        [common_1.HttpStatus.OK]: routes.deleteOneBase.returnDeleted
                            ? {
                                description: 'Delete one base response',
                                schema: { $ref: exports.swagger.getSchemaPath(swaggerModels.delete.name) },
                            }
                            : {
                                description: 'Delete one base response',
                            },
                    };
                case 'recoverOneBase':
                    if (oldVersion) {
                        return {
                            [common_1.HttpStatus.OK]: routes.recoverOneBase.returnRecovered
                                ? {
                                    type: swaggerModels.delete,
                                }
                                : {},
                        };
                    }
                    return {
                        [common_1.HttpStatus.OK]: routes.recoverOneBase.returnRecovered
                            ? {
                                description: 'Recover one base response',
                                schema: { $ref: exports.swagger.getSchemaPath(swaggerModels.recover.name) },
                            }
                            : {
                                description: 'Recover one base response',
                            },
                    };
                default:
                    const dto = swaggerModels[name.split('OneBase')[0]];
                    if (oldVersion) {
                        return {
                            [common_1.HttpStatus.OK]: {
                                type: dto,
                            },
                        };
                    }
                    return {
                        [common_1.HttpStatus.OK]: {
                            description: 'Response',
                            schema: { $ref: exports.swagger.getSchemaPath(dto.name) },
                        },
                    };
            }
        }
        else {
            return {};
        }
    }
    static createPathParamsMeta(options) {
        return exports.swaggerConst
            ? util_1.objKeys(options).map((param) => ({
                name: param,
                required: true,
                in: 'path',
                type: options[param].type === 'number' ? Number : String,
                enum: options[param].enum ? Object.values(options[param].enum) : undefined,
            }))
            : [];
    }
    static createQueryParamsMeta(name, options) {
        if (!exports.swaggerConst) {
            return [];
        }
        const { delim: d, delimStr: coma, fields, search, filter, or, join, sort, limit, offset, page, cache, includeDeleted, } = Swagger.getQueryParamsNames();
        const oldVersion = Swagger.getSwaggerVersion() < 4;
        const docsLink = (a) => `<a href="https://github.com/nestjsx/crud/wiki/Requests#${a}" target="_blank">Docs</a>`;
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
                type: 'array',
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
                type: 'array',
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
                type: 'array',
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
                type: 'array',
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
            ? {
                ...cacheMetaBase,
                type: 'integer',
                minimum: 0,
                maximum: 1,
            }
            : { ...cacheMetaBase, schema: { type: 'integer', minimum: 0, maximum: 1 } };
        const includeDeletedMetaBase = {
            name: includeDeleted,
            description: `Include deleted. ${docsLink('includeDeleted')}`,
            required: false,
            in: 'query',
        };
        const includeDeletedMeta = oldVersion
            ? {
                ...includeDeletedMetaBase,
                type: 'integer',
                minimum: 0,
                maximum: 1,
            }
            : {
                ...includeDeletedMetaBase,
                schema: { type: 'integer', minimum: 0, maximum: 1 },
            };
        switch (name) {
            case 'getManyBase':
                return options.query.softDelete
                    ? [
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
                        includeDeletedMeta,
                    ]
                    : [
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
                return options.query.softDelete
                    ? [fieldsMeta, joinMeta, cacheMeta, includeDeletedMeta]
                    : [fieldsMeta, joinMeta, cacheMeta];
            default:
                return [];
        }
    }
    static getQueryParamsNames() {
        const qbOptions = crud_request_1.RequestQueryBuilder.getOptions();
        const name = (n) => {
            const selected = qbOptions.paramNamesMap[n];
            return util_1.isString(selected) ? selected : selected[0];
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
            includeDeleted: name('includeDeleted'),
        };
    }
    static getSwaggerVersion() {
        return exports.swaggerPkgJson
            ? parseInt(exports.swaggerPkgJson.version[0], 10)
            : 3;
    }
}
exports.Swagger = Swagger;
function ApiProperty(options) {
    return (target, propertyKey) => {
        if (exports.swagger) {
            const ApiPropertyDecorator = exports.swagger.ApiProperty || exports.swagger.ApiModelProperty;
            ApiPropertyDecorator(options)(target, propertyKey);
        }
    };
}
exports.ApiProperty = ApiProperty;
//# sourceMappingURL=swagger.helper.js.map
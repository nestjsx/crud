"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@nestjsx/util");
const crud_request_1 = require("@nestjsx/crud-request");
const util_2 = require("../util");
const reflection_helper_1 = require("./reflection.helper");
exports.swaggerPkg = util_2.safeRequire('@nestjs/swagger/dist/constants');
class Swagger {
    static operationsMap(modelName) {
        return {
            getManyBase: `Retrieve many ${modelName}`,
            getOneBase: `Retrieve one ${modelName}`,
            createManyBase: `Create many ${modelName}`,
            createOneBase: `Create one ${modelName}`,
            updateOneBase: `Update one ${modelName}`,
            deleteOneBase: `Delete one ${modelName}`,
        };
    }
    static setOperation(name, modelName, func) {
        if (exports.swaggerPkg) {
            const summary = Swagger.operationsMap(modelName)[name];
            reflection_helper_1.R.set(exports.swaggerPkg.DECORATORS.API_OPERATION, { summary }, func);
        }
    }
    static setParams(metadata, func) {
        if (exports.swaggerPkg) {
            reflection_helper_1.R.set(exports.swaggerPkg.DECORATORS.API_PARAMETERS, metadata, func);
        }
    }
    static setResponseOk(metadata, func) {
        if (exports.swaggerPkg) {
            reflection_helper_1.R.set(exports.swaggerPkg.DECORATORS.API_RESPONSE, metadata, func);
        }
    }
    static getOperation(func) {
        return exports.swaggerPkg ? reflection_helper_1.R.get(exports.swaggerPkg.DECORATORS.API_OPERATION, func) || {} : {};
    }
    static getParams(func) {
        return exports.swaggerPkg ? reflection_helper_1.R.get(exports.swaggerPkg.DECORATORS.API_PARAMETERS, func) || [] : [];
    }
    static getResponseOk(func) {
        return exports.swaggerPkg ? reflection_helper_1.R.get(exports.swaggerPkg.DECORATORS.API_RESPONSE, func) || {} : {};
    }
    static createReponseOkMeta(status, isArray, dto) {
        return exports.swaggerPkg
            ? {
                [status]: {
                    type: dto,
                    isArray,
                    description: '',
                },
            }
            : {};
    }
    static createPathParasmMeta(options) {
        return exports.swaggerPkg
            ? util_1.objKeys(options).map((param) => ({
                name: param,
                required: true,
                in: 'path',
                type: options[param].type === 'number' ? Number : String,
            }))
            : [];
    }
    static createQueryParamsMeta(name) {
        if (!exports.swaggerPkg) {
            return [];
        }
        const { delim, delimStr: coma, fields, filter, or, join, sort, limit, offset, page, cache, } = Swagger.getQueryParamsNames();
        switch (name) {
            case 'getManyBase':
                return [
                    {
                        name: fields,
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
        const qbOptions = crud_request_1.RequestQueryBuilder.getOptions();
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
exports.Swagger = Swagger;
//# sourceMappingURL=swagger.helper.js.map
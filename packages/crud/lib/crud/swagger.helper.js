"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@nestjsx/util");
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
    static getOperation(func) {
        return exports.swaggerPkg ? reflection_helper_1.R.get(exports.swaggerPkg.DECORATORS.API_OPERATION, func) || {} : {};
    }
    static getParams(func) {
        return exports.swaggerPkg ? reflection_helper_1.R.get(exports.swaggerPkg.DECORATORS.API_PARAMETERS, func) || [] : [];
    }
    static createPathParamMeta(options) {
        return exports.swaggerPkg
            ? util_1.objKeys(options).map((param) => ({
                name: param,
                required: true,
                in: 'path',
                type: options[param].type === 'number' ? Number : String,
            }))
            : [];
    }
}
exports.Swagger = Swagger;
//# sourceMappingURL=swagger.helper.js.map
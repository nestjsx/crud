"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const crypto = require("crypto");
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("@nestjs/common/constants");
const BASE_PATH_METADATA = 'BASE_PATH_METADATA';
const BASE_METHOD_METADATA = 'BASE_METHOD_METADATA';
const OVERRIDE_METHOD_METADATA = 'OVERRIDE_METHOD_METADATA';
exports.Route = (method = common_1.RequestMethod.GET, path = '/') => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(BASE_PATH_METADATA, path, descriptor.value);
        Reflect.defineMetadata(BASE_METHOD_METADATA, method, descriptor.value);
        return descriptor;
    };
};
exports.Inherit = () => (target) => {
    const baseController = Object.getPrototypeOf(target);
    const methods = Object.getOwnPropertyNames(baseController.prototype);
    const prototype = target.prototype;
    methods.forEach((name) => {
        const path = Reflect.getMetadata(BASE_PATH_METADATA, baseController.prototype[name]);
        const method = Reflect.getMetadata(BASE_METHOD_METADATA, baseController.prototype[name]);
        const override = Reflect.getMetadata(OVERRIDE_METHOD_METADATA, baseController.prototype[name]);
        if (!shared_utils_1.isNil(path) && !shared_utils_1.isNil(method)) {
            if (override) {
                const random = crypto.randomBytes(16).toString('hex');
                const overrideName = `${override}Override${random}`;
                prototype[overrideName] = function (...args) {
                    return this[name](...args);
                };
                const paramsMetadata = Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, target, override);
                if (paramsMetadata) {
                    Reflect.defineMetadata(constants_1.ROUTE_ARGS_METADATA, paramsMetadata, target, overrideName);
                }
                const metadataKeys = Reflect.getMetadataKeys(prototype[name]);
                if (metadataKeys && metadataKeys.length) {
                    metadataKeys.forEach((key) => {
                        const metadata = Reflect.getMetadata(key, prototype[name]);
                        Reflect.defineMetadata(key, metadata, prototype[overrideName]);
                    });
                }
                Reflect.defineMetadata(constants_1.PATH_METADATA, path, prototype[overrideName]);
                Reflect.defineMetadata(constants_1.METHOD_METADATA, method, prototype[overrideName]);
            }
            else {
                Reflect.defineMetadata(constants_1.PATH_METADATA, path, prototype[name]);
                Reflect.defineMetadata(constants_1.METHOD_METADATA, method, prototype[name]);
            }
        }
    });
};
exports.Override = () => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(OVERRIDE_METHOD_METADATA, key, Object.getPrototypeOf(target)[key]);
        return descriptor;
    };
};
//# sourceMappingURL=inherit-override.decorator.js.map
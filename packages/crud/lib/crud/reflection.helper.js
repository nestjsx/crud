"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@nestjs/common/constants");
const constants_2 = require("../constants");
class R {
    static set(metadataKey, metadataValue, target) {
        Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
    static get(metadataKey, target) {
        return Reflect.getMetadata(metadataKey, target);
    }
    static setCrudOptions(options, target) {
        R.set(constants_2.CRUD_OPTIONS_METADATA, options, target);
    }
    static setRoute(route, func) {
        R.set(constants_1.PATH_METADATA, route.path, func);
        R.set(constants_1.METHOD_METADATA, route.method, func);
    }
    static setInterceptors(interceptors, func) {
        R.set(constants_1.INTERCEPTORS_METADATA, interceptors, func);
    }
    static getCrudOptions(target) {
        return R.get(constants_2.CRUD_OPTIONS_METADATA, target);
    }
}
exports.R = R;
//# sourceMappingURL=reflection.helper.js.map
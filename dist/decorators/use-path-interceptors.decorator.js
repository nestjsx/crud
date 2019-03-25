"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extend_metadata_util_1 = require("@nestjs/common/utils/extend-metadata.util");
const constants_1 = require("@nestjs/common/constants");
const interceptors_1 = require("../interceptors");
function UsePathInterceptors(...names) {
    return (target, key, descriptor) => {
        const all = ['query', 'param'];
        const every = (arr) => all.every((n) => arr.some((name) => name === n));
        const some = (arr, name) => arr.some((n) => name === n);
        let interceptors = [];
        if (!names || !Array.isArray(names) || !names.length || every(names)) {
            interceptors = [interceptors_1.RestfulQueryInterceptor, interceptors_1.RestfulParamsInterceptor];
        }
        else if (some(names, 'query')) {
            interceptors = [interceptors_1.RestfulQueryInterceptor];
        }
        else if (some(names, 'param')) {
            interceptors = [interceptors_1.RestfulParamsInterceptor];
        }
        if (descriptor) {
            extend_metadata_util_1.extendArrayMetadata(constants_1.INTERCEPTORS_METADATA, interceptors, descriptor.value);
            return descriptor;
        }
        extend_metadata_util_1.extendArrayMetadata(constants_1.INTERCEPTORS_METADATA, interceptors, target);
        return target;
    };
}
exports.UsePathInterceptors = UsePathInterceptors;
//# sourceMappingURL=use-path-interceptors.decorator.js.map
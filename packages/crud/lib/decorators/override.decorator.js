"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.Override = (name) => (target, key, descriptor) => {
    Reflect.defineMetadata(constants_1.OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
    return descriptor;
};
//# sourceMappingURL=override.decorator.js.map
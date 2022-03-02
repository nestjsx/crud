"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.ParsedBody = () => (target, key, index) => {
    Reflect.defineMetadata(constants_1.PARSED_BODY_METADATA, { index }, target[key]);
};
//# sourceMappingURL=parsed-body.decorator.js.map
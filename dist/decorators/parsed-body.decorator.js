"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
function ParsedBody() {
    return (target, key, index) => {
        helpers_1.setParsedBody({ index }, target[key]);
    };
}
exports.ParsedBody = ParsedBody;
//# sourceMappingURL=parsed-body.decorator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
exports.ParsedParams = common_1.createParamDecorator((data, req) => {
    return req[constants_1.PARSED_PARAMS_REQUEST_KEY];
});
//# sourceMappingURL=parsed-params.decorator.js.map
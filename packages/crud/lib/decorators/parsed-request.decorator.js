"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
exports.ParsedRequest = common_1.createParamDecorator((_, req) => {
    return req[constants_1.PARSED_CRUD_REQUEST_KEY];
});
//# sourceMappingURL=parsed-request.decorator.js.map
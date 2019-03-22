"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
exports.ParsedQuery = common_1.createParamDecorator((data, req) => {
    return req[constants_1.PARSED_QUERY_REQUEST_KEY];
});
//# sourceMappingURL=parsed-query.decorator.js.map
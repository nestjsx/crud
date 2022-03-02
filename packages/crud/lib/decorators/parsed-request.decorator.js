"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const reflection_helper_1 = require("../crud/reflection.helper");
exports.ParsedRequest = common_1.createParamDecorator((_, ctx) => {
    return reflection_helper_1.R.getContextRequest(ctx)[constants_1.PARSED_CRUD_REQUEST_KEY];
});
//# sourceMappingURL=parsed-request.decorator.js.map
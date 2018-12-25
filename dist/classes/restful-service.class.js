"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class RestfulService {
    constructor() { }
    throwBadRequestException(msg) {
        throw new common_1.BadRequestException(msg);
    }
    throwNotFoundException(name) {
        throw new common_1.NotFoundException(`${name} not found`);
    }
}
exports.RestfulService = RestfulService;
//# sourceMappingURL=restful-service.class.js.map
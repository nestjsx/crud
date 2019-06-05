"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class CrudService {
    constructor() { }
    throwBadRequestException(msg) {
        throw new common_1.BadRequestException(msg);
    }
    throwNotFoundException(name) {
        throw new common_1.NotFoundException(`${name} not found`);
    }
    createPageInfo(data, total, limit, offset) {
        return {
            data,
            count: data.length,
            total,
            page: Math.floor(offset / limit) + 1,
            pageCount: limit && total
                ? Math.round(total / limit)
                :
                    undefined,
        };
    }
}
exports.CrudService = CrudService;
//# sourceMappingURL=crud-service.abstract.js.map
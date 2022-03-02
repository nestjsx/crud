"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const util_1 = require("@nestjsx/util");
class CrudService {
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
            page: limit ? Math.floor(offset / limit) + 1 : 1,
            pageCount: limit && total ? Math.ceil(total / limit) : 1,
        };
    }
    decidePagination(parsed, options) {
        return (options.query.alwaysPaginate ||
            ((Number.isFinite(parsed.page) || Number.isFinite(parsed.offset)) &&
                !!this.getTake(parsed, options.query)));
    }
    getTake(query, options) {
        if (query.limit) {
            return options.maxLimit
                ? query.limit <= options.maxLimit
                    ? query.limit
                    : options.maxLimit
                : query.limit;
        }
        if (options.limit) {
            return options.maxLimit
                ? options.limit <= options.maxLimit
                    ? options.limit
                    : options.maxLimit
                : options.limit;
        }
        return options.maxLimit ? options.maxLimit : null;
    }
    getSkip(query, take) {
        return query.page && take
            ? take * (query.page - 1)
            : query.offset
                ? query.offset
                : null;
    }
    getPrimaryParams(options) {
        const params = util_1.objKeys(options.params).filter((n) => options.params[n] && options.params[n].primary);
        return params.map((p) => options.params[p].field);
    }
}
exports.CrudService = CrudService;
//# sourceMappingURL=crud-service.abstract.js.map
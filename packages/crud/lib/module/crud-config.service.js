"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crud_request_1 = require("@nestjsx/crud-request");
const util_1 = require("@nestjsx/util");
const deepmerge = require("deepmerge");
class CrudConfigService {
    static load(config = {}) {
        if (util_1.isObjectFull(config.queryParser)) {
            crud_request_1.RequestQueryBuilder.setOptions(config.queryParser);
        }
        const query = util_1.isObjectFull(config.query) ? config.query : {};
        const routes = util_1.isObjectFull(config.routes) ? config.routes : {};
        const params = util_1.isObjectFull(config.params) ? config.params : {};
        CrudConfigService.config = deepmerge(CrudConfigService.config, { query, routes, params }, { arrayMerge: (a, b, c) => b });
    }
}
CrudConfigService.config = {
    query: {},
    routes: {
        getManyBase: { interceptors: [], decorators: [] },
        getOneBase: { interceptors: [], decorators: [] },
        createOneBase: { interceptors: [], decorators: [] },
        createManyBase: { interceptors: [], decorators: [] },
        updateOneBase: { interceptors: [], decorators: [], allowParamsOverride: false },
        replaceOneBase: { interceptors: [], decorators: [], allowParamsOverride: false },
        deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
    },
    params: {
        id: {
            field: 'id',
            type: 'number',
            primary: true,
        },
    },
};
exports.CrudConfigService = CrudConfigService;
//# sourceMappingURL=crud-config.service.js.map
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
        const auth = util_1.isObjectFull(config.auth) ? config.auth : {};
        const query = util_1.isObjectFull(config.query) ? config.query : {};
        const routes = util_1.isObjectFull(config.routes) ? config.routes : {};
        const params = util_1.isObjectFull(config.params) ? config.params : {};
        const serialize = util_1.isObjectFull(config.serialize) ? config.serialize : {};
        CrudConfigService.config = deepmerge(CrudConfigService.config, { auth, query, routes, params, serialize }, { arrayMerge: (a, b, c) => b });
    }
}
exports.CrudConfigService = CrudConfigService;
CrudConfigService.config = {
    auth: {},
    query: {
        alwaysPaginate: false,
    },
    routes: {
        getManyBase: { interceptors: [], decorators: [] },
        getOneBase: { interceptors: [], decorators: [] },
        createOneBase: { interceptors: [], decorators: [], returnShallow: false },
        createManyBase: { interceptors: [], decorators: [] },
        updateOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: false,
            returnShallow: false,
        },
        replaceOneBase: {
            interceptors: [],
            decorators: [],
            allowParamsOverride: false,
            returnShallow: false,
        },
        deleteOneBase: { interceptors: [], decorators: [], returnDeleted: false },
        recoverOneBase: { interceptors: [], decorators: [], returnRecovered: false },
    },
    params: {},
};
//# sourceMappingURL=crud-config.service.js.map
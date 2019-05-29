"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@nestjsx/util");
function setOptionsDefaults(options, target) {
    if (!util_1.isObjectFull(options.param)) {
        options.param = {
            id: {
                field: 'id',
                type: 'number',
            },
        };
        if (!util_1.isObjectFull(options.routes)) {
            options.routes = {};
        }
        if (!util_1.isObjectFull(options.routes.getManyBase)) {
            options.routes.getManyBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(options.routes.getOneBase)) {
            options.routes.getOneBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(options.routes.createOneBase)) {
            options.routes.createOneBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(options.routes.createManyBase)) {
            options.routes.createManyBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(options.routes.updateOneBase)) {
            options.routes.updateOneBase = {
                allowParamsOverride: false,
                interceptors: [],
                decorators: [],
            };
        }
        if (!util_1.isObjectFull(options.routes.deleteOneBase)) {
            options.routes.deleteOneBase = {
                returnDeleted: false,
                interceptors: [],
                decorators: [],
            };
        }
    }
}
exports.setOptionsDefaults = setOptionsDefaults;
//# sourceMappingURL=crud-options.defaults.js.map
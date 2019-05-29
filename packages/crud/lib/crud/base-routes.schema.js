"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const util_1 = require("@nestjsx/util");
function getBaseRoutesSchema() {
    return [
        {
            name: 'getManyBase',
            path: '/',
            method: common_1.RequestMethod.GET,
            enable: false,
            override: false,
        },
        {
            name: 'getOneBase',
            path: '',
            method: common_1.RequestMethod.GET,
            enable: false,
            override: false,
        },
        {
            name: 'createOneBase',
            path: '/',
            method: common_1.RequestMethod.POST,
            enable: false,
            override: false,
        },
        {
            name: 'createManyBase',
            path: '/bulk',
            method: common_1.RequestMethod.POST,
            enable: false,
            override: false,
        },
        {
            name: 'updateOneBase',
            path: '',
            method: common_1.RequestMethod.PATCH,
            enable: false,
            override: false,
        },
        {
            name: 'deleteOneBase',
            path: '',
            method: common_1.RequestMethod.DELETE,
            enable: false,
            override: false,
        },
    ];
}
exports.getBaseRoutesSchema = getBaseRoutesSchema;
function isRouteEnabled(name, options) {
    if (util_1.isArrayFull(options.only)) {
        return options.only.some((route) => route === name);
    }
    if (util_1.isArrayFull(options.exclude)) {
        return !options.exclude.some((route) => route === name);
    }
    return true;
}
exports.isRouteEnabled = isRouteEnabled;
//# sourceMappingURL=base-routes.schema.js.map
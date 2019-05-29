"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crud_1 = require("../crud");
exports.Crud = (options = {}) => (target, options) => {
    const prototype = target.prototype;
    const baseRoutes = crud_1.getBaseRoutesSchema();
    crud_1.setOptionsDefaults(options, target);
    baseRoutes.forEach((route) => {
        if (crud_1.isRouteEnabled(route.name, options.routes)) {
        }
    });
};
//# sourceMappingURL=crud.decorator.js.map
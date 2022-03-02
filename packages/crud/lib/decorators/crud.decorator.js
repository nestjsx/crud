"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crud_1 = require("../crud");
exports.Crud = (options) => (target) => {
    const factoryMethod = options.routesFactory || crud_1.CrudRoutesFactory;
    let factory = new factoryMethod(target, options);
    factory = undefined;
};
//# sourceMappingURL=crud.decorator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crud_1 = require("../crud");
exports.Crud = (options) => (target) => {
    let factory = crud_1.CrudRoutesFactory.create(target, options);
    factory = undefined;
};
//# sourceMappingURL=crud.decorator.js.map
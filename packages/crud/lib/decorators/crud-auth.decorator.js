"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflection_helper_1 = require("../crud/reflection.helper");
exports.CrudAuth = (options) => (target) => {
    reflection_helper_1.R.setCrudAuthOptions(options, target);
};
//# sourceMappingURL=crud-auth.decorator.js.map
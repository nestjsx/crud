"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflection_helper_1 = require("../crud/reflection.helper");
class CrudBaseInterceptor {
    getCrudInfo(context) {
        const ctrl = context.getClass();
        const handler = context.getHandler();
        const ctrlOptions = reflection_helper_1.R.getCrudOptions(ctrl);
        const crudOptions = ctrlOptions
            ? ctrlOptions
            : {
                query: {},
                routes: {},
                params: {},
            };
        const action = reflection_helper_1.R.getAction(handler);
        return { ctrlOptions, crudOptions, action };
    }
}
exports.CrudBaseInterceptor = CrudBaseInterceptor;
//# sourceMappingURL=crud-base.interceptor.js.map
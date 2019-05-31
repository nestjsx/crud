"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const request_query_parser_1 = require("@nestjsx/crud-request/lib/request-query.parser");
const reflection_helper_1 = require("../crud/reflection.helper");
const constants_1 = require("../constants");
let CrudRequestInterceptor = class CrudRequestInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const controller = context.getClass();
        const options = reflection_helper_1.R.getCrudOptions(controller);
        const { query, routes, params } = options;
        const parsed = request_query_parser_1.RequestQueryParser.create()
            .parseParams(req.params, options.params)
            .parseQuery(req.query)
            .getParsed();
        req[constants_1.PARSED_CRUD_REQUEST_KEY] = Object.assign({}, parsed, { options: { query, routes, params } });
        return next.handle();
    }
};
CrudRequestInterceptor = __decorate([
    common_1.Injectable()
], CrudRequestInterceptor);
exports.CrudRequestInterceptor = CrudRequestInterceptor;
//# sourceMappingURL=crud-request.interceptor.js.map
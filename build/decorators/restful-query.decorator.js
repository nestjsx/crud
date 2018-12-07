"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const restful_query_pipe_1 = require("../pipes/restful-query.pipe");
const restful_query_validation_pipe_1 = require("../pipes/restful-query-validation.pipe");
exports.RestfulQuery = (...args) => common_1.Query(restful_query_pipe_1.RestfulQueryPipe, restful_query_validation_pipe_1.RestfulQueryValidationPipe, ...args);
//# sourceMappingURL=restful-query.decorator.js.map
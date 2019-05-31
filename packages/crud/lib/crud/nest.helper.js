"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@nestjs/common/constants");
const constants_2 = require("../constants");
class N {
    static setCustomRouteDecorator(paramtype, index, pipes = [], data = undefined) {
        return {
            [`${paramtype}${constants_1.CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
                index,
                factory: (_, req) => req[paramtype],
                data,
                pipes,
            },
        };
    }
    static setParsedRequest(index) {
        return N.setCustomRouteDecorator(constants_2.PARSED_CRUD_REQUEST_KEY, index);
    }
}
exports.N = N;
//# sourceMappingURL=nest.helper.js.map
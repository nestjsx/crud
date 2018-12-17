"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
exports.Feature = (name) => common_1.ReflectMetadata(constants_1.FEAUTURE_NAME_METADATA, name);
exports.Action = (name) => common_1.ReflectMetadata(constants_1.ACTION_NAME_METADATA, name);
//# sourceMappingURL=feature-action.decorator.js.map
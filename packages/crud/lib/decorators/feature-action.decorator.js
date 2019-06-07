"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
exports.Feature = (name) => common_1.SetMetadata(constants_1.FEAUTURE_NAME_METADATA, name);
exports.Action = (name) => common_1.SetMetadata(constants_1.ACTION_NAME_METADATA, name);
exports.getFeature = (target) => Reflect.getMetadata(constants_1.FEAUTURE_NAME_METADATA, target);
exports.getAction = (target) => Reflect.getMetadata(constants_1.ACTION_NAME_METADATA, target);
//# sourceMappingURL=feature-action.decorator.js.map
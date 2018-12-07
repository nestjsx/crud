"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const enums_1 = require("../enums");
exports.Feature = (name) => common_1.ReflectMetadata(constants_1.FEAUTURE_NAME_METADATA, name);
exports.Action = (name) => common_1.ReflectMetadata(constants_1.ACTION_NAME_METADATA, name);
exports.ReadAll = () => exports.Action(enums_1.CrudActions.ReadAll);
exports.ReadOne = () => exports.Action(enums_1.CrudActions.ReadOne);
exports.CreateMany = () => exports.Action(enums_1.CrudActions.CreateMany);
exports.CreateOne = () => exports.Action(enums_1.CrudActions.CreateOne);
exports.UpdateOne = () => exports.Action(enums_1.CrudActions.UpdateOne);
exports.DeleteOne = () => exports.Action(enums_1.CrudActions.DeleteOne);
exports.DeleteAll = () => exports.Action(enums_1.CrudActions.DeleteAll);
//# sourceMappingURL=feature-action.decorator.js.map
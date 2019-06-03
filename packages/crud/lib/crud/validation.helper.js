"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const util_1 = require("@nestjsx/util");
const util_2 = require("../util");
const enums_1 = require("../enums");
const validator = util_2.safeRequire('class-validator');
const transformer = util_2.safeRequire('class-transformer');
class Validation {
    static getValidationPipe(options, group) {
        return validator && !util_1.isFalse(options.validation)
            ? new common_1.ValidationPipe(Object.assign({}, (options.validation || {}), { groups: [group] }))
            : undefined;
    }
    static createBulkDto(options) {
        if (validator && transformer && !util_1.isFalse(options.validation)) {
            const { IsArray, ArrayNotEmpty, ValidateNested } = validator;
            const { Type } = transformer;
            const groups = [enums_1.CrudValidationGroups.CREATE];
            class BulkDto {
            }
            __decorate([
                IsArray({ groups }),
                ArrayNotEmpty({ groups }),
                ValidateNested({ each: true, groups }),
                Type((t) => options.model.type),
                __metadata("design:type", Array)
            ], BulkDto.prototype, "bulk", void 0);
            return BulkDto;
        }
        else {
            class BulkDto {
            }
            return BulkDto;
        }
    }
}
exports.Validation = Validation;
//# sourceMappingURL=validation.helper.js.map
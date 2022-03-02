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
const enums_1 = require("../enums");
const util_2 = require("../util");
const swagger_helper_1 = require("./swagger.helper");
const validator = util_2.safeRequire('class-validator', () => require('class-validator'));
const transformer = util_2.safeRequire('class-transformer', () => require('class-transformer'));
class BulkDto {
}
class Validation {
    static getValidationPipe(options, group) {
        return validator && !util_1.isFalse(options.validation)
            ? new common_1.ValidationPipe({
                ...(options.validation || {}),
                groups: group ? [group] : undefined,
            })
            : undefined;
    }
    static createBulkDto(options) {
        if (validator && transformer && !util_1.isFalse(options.validation)) {
            const { IsArray, ArrayNotEmpty, ValidateNested } = validator;
            const { Type } = transformer;
            const hasDto = !util_1.isNil(options.dto.create);
            const groups = !hasDto ? [enums_1.CrudValidationGroups.CREATE] : undefined;
            const always = hasDto ? true : undefined;
            const Model = hasDto ? options.dto.create : options.model.type;
            class BulkDtoImpl {
            }
            __decorate([
                swagger_helper_1.ApiProperty({ type: Model, isArray: true }),
                IsArray({ groups, always }),
                ArrayNotEmpty({ groups, always }),
                ValidateNested({ each: true, groups, always }),
                Type(() => Model),
                __metadata("design:type", Array)
            ], BulkDtoImpl.prototype, "bulk", void 0);
            Object.defineProperty(BulkDtoImpl, 'name', {
                writable: false,
                value: `CreateMany${options.model.type.name}Dto`,
            });
            return BulkDtoImpl;
        }
        else {
            return BulkDto;
        }
    }
}
exports.Validation = Validation;
//# sourceMappingURL=validation.helper.js.map
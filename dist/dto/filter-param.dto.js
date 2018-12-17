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
const utils_1 = require("../utils");
const operators_list_1 = require("../operators.list");
const IsString = utils_1.mockValidatorDecorator('IsString');
const IsNotEmpty = utils_1.mockValidatorDecorator('IsNotEmpty');
const IsIn = utils_1.mockValidatorDecorator('IsIn');
const IsOptional = utils_1.mockValidatorDecorator('IsOptional');
class FilterParamDto {
}
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], FilterParamDto.prototype, "field", void 0);
__decorate([
    IsNotEmpty(),
    IsIn(operators_list_1.COMPARISON_OPERATORS),
    __metadata("design:type", String)
], FilterParamDto.prototype, "operator", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Object)
], FilterParamDto.prototype, "value", void 0);
exports.FilterParamDto = FilterParamDto;
//# sourceMappingURL=filter-param.dto.js.map
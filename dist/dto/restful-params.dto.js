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
const filter_param_dto_1 = require("./filter-param.dto");
const sort_param_dto_1 = require("./sort-param.dto");
const join_param_dto_1 = require("./join-param.dto");
const IsOptional = utils_1.mockValidatorDecorator('IsOptional');
const IsString = utils_1.mockValidatorDecorator('IsString');
const IsNumber = utils_1.mockValidatorDecorator('IsNumber');
const ValidateNested = utils_1.mockValidatorDecorator('ValidateNested');
const Type = utils_1.mockTransformerDecorator('Type');
class RestfulParamsDto {
}
__decorate([
    IsOptional(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], RestfulParamsDto.prototype, "fields", void 0);
__decorate([
    IsOptional(),
    ValidateNested({ each: true }),
    Type((t) => filter_param_dto_1.FilterParamDto),
    __metadata("design:type", Array)
], RestfulParamsDto.prototype, "filter", void 0);
__decorate([
    IsOptional(),
    ValidateNested({ each: true }),
    Type((t) => filter_param_dto_1.FilterParamDto),
    __metadata("design:type", Array)
], RestfulParamsDto.prototype, "or", void 0);
__decorate([
    IsOptional(),
    ValidateNested({ each: true }),
    Type((t) => join_param_dto_1.JoinParamDto),
    __metadata("design:type", Array)
], RestfulParamsDto.prototype, "join", void 0);
__decorate([
    IsOptional(),
    ValidateNested({ each: true }),
    Type((t) => sort_param_dto_1.SortParamDto),
    __metadata("design:type", Array)
], RestfulParamsDto.prototype, "sort", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], RestfulParamsDto.prototype, "limit", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], RestfulParamsDto.prototype, "offset", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], RestfulParamsDto.prototype, "page", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], RestfulParamsDto.prototype, "cache", void 0);
exports.RestfulParamsDto = RestfulParamsDto;
//# sourceMappingURL=restful-params.dto.js.map
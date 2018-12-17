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
const IsNotEmpty = utils_1.mockValidatorDecorator('IsNotEmpty');
const IsString = utils_1.mockValidatorDecorator('IsString');
const IsOptional = utils_1.mockValidatorDecorator('IsOptional');
class JoinParamDto {
}
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], JoinParamDto.prototype, "field", void 0);
__decorate([
    IsOptional(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], JoinParamDto.prototype, "select", void 0);
exports.JoinParamDto = JoinParamDto;
//# sourceMappingURL=join-param.dto.js.map
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
const class_transformer_1 = require("class-transformer");
const swagger_helper_1 = require("./swagger.helper");
class SerializeHelper {
    static createGetManyDto(dto, resourceName) {
        class GetManyResponseDto {
        }
        __decorate([
            swagger_helper_1.ApiProperty({ type: dto, isArray: true }),
            class_transformer_1.Type(() => dto),
            __metadata("design:type", Array)
        ], GetManyResponseDto.prototype, "data", void 0);
        __decorate([
            swagger_helper_1.ApiProperty({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "count", void 0);
        __decorate([
            swagger_helper_1.ApiProperty({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "total", void 0);
        __decorate([
            swagger_helper_1.ApiProperty({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "page", void 0);
        __decorate([
            swagger_helper_1.ApiProperty({ type: 'number' }),
            __metadata("design:type", Number)
        ], GetManyResponseDto.prototype, "pageCount", void 0);
        Object.defineProperty(GetManyResponseDto, 'name', {
            writable: false,
            value: `GetMany${resourceName}ResponseDto`,
        });
        return GetManyResponseDto;
    }
    static createGetOneResponseDto(resourceName) {
        class GetOneResponseDto {
        }
        Object.defineProperty(GetOneResponseDto, 'name', {
            writable: false,
            value: `${resourceName}ResponseDto`,
        });
        return GetOneResponseDto;
    }
}
exports.SerializeHelper = SerializeHelper;
//# sourceMappingURL=serialize.helper.js.map
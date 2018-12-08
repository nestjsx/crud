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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const decorators_1 = require("../decorators");
class CrudController {
    constructor(service) {
        this.service = service;
    }
    getMany(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = this.getParamsFilter(params);
            return this.service.getMany(query, { filter });
        });
    }
    getOne(params, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = this.getParamsFilter(params);
            return this.service.getOne(params.id, query, { filter });
        });
    }
    createOne() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    createMany() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    updateOne() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    deleteOne() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getParamsFilter(params) {
        if (!this.paramsFilter || !params) {
            return [];
        }
        const isArray = Array.isArray(this.paramsFilter);
        return (isArray ? this.paramsFilter : Object.keys(this.paramsFilter))
            .filter((field) => !!params[field])
            .map((field) => ({
            field: isArray ? field : this.paramsFilter[field],
            operator: 'eq',
            value: params[field],
        }));
    }
}
__decorate([
    decorators_1.Route(common_1.RequestMethod.GET),
    decorators_1.ReadAll(),
    __param(0, decorators_1.RestfulQuery()), __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "getMany", null);
__decorate([
    decorators_1.Route(common_1.RequestMethod.GET, ':id'),
    decorators_1.ReadOne(),
    __param(0, common_1.Param()), __param(1, decorators_1.RestfulQuery()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "getOne", null);
__decorate([
    decorators_1.Route(common_1.RequestMethod.POST),
    decorators_1.CreateOne(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "createOne", null);
__decorate([
    decorators_1.Route(common_1.RequestMethod.POST, 'bulk'),
    decorators_1.CreateMany(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "createMany", null);
__decorate([
    decorators_1.Route(common_1.RequestMethod.PATCH, ':id'),
    decorators_1.UpdateOne(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "updateOne", null);
__decorate([
    decorators_1.Route(common_1.RequestMethod.DELETE, ':id'),
    decorators_1.DeleteOne(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "deleteOne", null);
exports.CrudController = CrudController;
//# sourceMappingURL=crud-controller.class.js.map
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
const typeorm_1 = require("typeorm");
let CrudTypeOrmService = class CrudTypeOrmService {
    constructor(repository) {
        this.repository = repository;
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!entity || typeof entity !== 'object') {
                throw new common_1.BadRequestException();
            }
            try {
                return yield this.repository.save(entity);
            }
            catch (err) {
                throw new common_1.BadRequestException(err.message);
            }
        });
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.save(entity);
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id) || typeof id !== 'number') {
                throw new common_1.BadRequestException();
            }
            const entity = yield this.repository.findOne(id);
            if (!entity) {
                throw new common_1.NotFoundException();
            }
            return entity;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find();
        });
    }
    update(id, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.getOne(id);
            return yield this.save(entity);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id) || typeof id !== 'number') {
                throw new common_1.BadRequestException();
            }
            try {
                yield this.repository.delete(id);
            }
            catch (err) {
                throw new common_1.NotFoundException();
            }
        });
    }
};
CrudTypeOrmService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CrudTypeOrmService);
exports.CrudTypeOrmService = CrudTypeOrmService;
//# sourceMappingURL=crud-typeorm.service.js.map
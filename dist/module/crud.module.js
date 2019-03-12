"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CrudModule_1;
const common_1 = require("@nestjs/common");
const crud_config_service_1 = require("./crud-config.service");
let CrudModule = CrudModule_1 = class CrudModule {
    static loadConfig(config = {}) {
        crud_config_service_1.CrudConfigService.load(config);
    }
    static forRoot() {
        return {
            module: CrudModule_1,
        };
    }
};
CrudModule = CrudModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], CrudModule);
exports.CrudModule = CrudModule;
//# sourceMappingURL=crud.module.js.map
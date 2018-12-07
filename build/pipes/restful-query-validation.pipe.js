"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
let RestfulQueryValidationPipe = class RestfulQueryValidationPipe {
    transform(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                forbidUnknownValues: true,
                validationError: {
                    target: false,
                    value: false,
                },
            };
            let errors = [];
            try {
                const { RestfulParamsDto } = require('../dto/restful-params.dto');
                const classValidator = require('class-validator');
                const classTransformer = require('class-transformer');
                const dto = classTransformer.plainToClass(RestfulParamsDto, value);
                errors = yield classValidator.validate(dto, options);
            }
            catch (error) { }
            if (errors.length) {
                throw new common_1.BadRequestException(errors);
            }
            return value;
        });
    }
};
RestfulQueryValidationPipe = __decorate([
    common_1.Injectable()
], RestfulQueryValidationPipe);
exports.RestfulQueryValidationPipe = RestfulQueryValidationPipe;
//# sourceMappingURL=restful-query-validation.pipe.js.map
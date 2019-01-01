"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let GetManyResponseInterceptor = class GetManyResponseInterceptor {
    intercept(context, call$) {
        return call$.pipe(operators_1.map((data) => {
            debugger;
            const query = context.switchToHttp().getRequest().query;
            const total = data[1];
            const limit = query.limit ? query.limit : total;
            const page = query.page ? query.page : 1;
            const startRange = (page - 1) * limit;
            const endRange = startRange + data[0].length;
            context.switchToHttp().getResponse().set('Content-Range', `${startRange}-${endRange}/${total}`);
            return data[0];
        }));
    }
};
GetManyResponseInterceptor = __decorate([
    common_1.Injectable()
], GetManyResponseInterceptor);
exports.GetManyResponseInterceptor = GetManyResponseInterceptor;
//# sourceMappingURL=get-many-response.interceptor.js.map
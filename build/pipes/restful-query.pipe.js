"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let RestfulQueryPipe = class RestfulQueryPipe {
    constructor() {
        this.delim = '||';
        this.delimStr = ',';
        this.reservedFields = [
            'fields',
            'filter',
            'filter[]',
            'or',
            'or[]',
            'sort',
            'sort[]',
            'join',
            'join[]',
            'per_page',
            'limit',
            'offset',
            'page',
            'cache',
        ];
    }
    transform(query) {
        const fields = this.splitString(query.fields);
        const filter = this.parseArray(query.filter || query['filter[]'], this.parseFilter);
        const or = this.parseArray(query.or || query['or[]'], this.parseFilter);
        const sort = this.parseArray(query.sort || query['sort[]'], this.parseSort);
        const join = this.parseArray(query.join || query['join[]'], this.parseJoin);
        const limit = this.parseInt(query.per_page || query.limit);
        const offset = this.parseInt(query.offset);
        const page = this.parseInt(query.page);
        const cache = this.parseInt(query.cache);
        const entityFields = this.parseEntityFields(query);
        const result = {
            filter: [...filter, ...entityFields],
            or,
            fields,
            sort,
            join,
            limit,
            offset,
            page,
            cache,
        };
        return result;
    }
    splitString(str) {
        try {
            return str ? str.split(this.delimStr) : [];
        }
        catch (error) {
            return str;
        }
    }
    parseInt(str) {
        return str ? parseInt(str, 10) : undefined;
    }
    parseFilter(str) {
        try {
            const isArrayValue = ['in', 'notin', 'beetwen'];
            const params = str.split(this.delim);
            const field = params[0];
            const operator = params[1];
            let value = params[2] || '';
            if (isArrayValue.some((name) => name === operator)) {
                value = this.splitString(value);
            }
            return {
                field,
                operator,
                value,
            };
        }
        catch (error) {
            return str;
        }
    }
    parseSort(str) {
        try {
            const params = str.split(this.delimStr);
            return {
                field: params[0],
                order: params[1],
            };
        }
        catch (error) {
            return str;
        }
    }
    parseJoin(str) {
        try {
            const params = str.split(this.delim);
            return {
                field: params[0],
                select: params[1] ? this.splitString(params[1]) : [],
            };
        }
        catch (error) {
            return str;
        }
    }
    parseArray(param, parser) {
        if (typeof param === 'string') {
            return [parser.call(this, param)];
        }
        if (Array.isArray(param) && param.length) {
            const result = [];
            for (let item of param) {
                result.push(parser.call(this, item));
            }
            return result;
        }
        return [];
    }
    parseEntityFields(query) {
        return Object.keys(query)
            .filter((key) => !this.reservedFields.some((reserved) => reserved === key))
            .map((field) => ({ field, operator: 'eq', value: query[field] }));
    }
};
RestfulQueryPipe = __decorate([
    common_1.Injectable()
], RestfulQueryPipe);
exports.RestfulQueryPipe = RestfulQueryPipe;
//# sourceMappingURL=restful-query.pipe.js.map
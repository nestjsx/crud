"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@nestjsx/util");
const request_query_builder_1 = require("./request-query.builder");
const request_query_validator_1 = require("./request-query.validator");
const exceptions_1 = require("./exceptions");
class RequestQueryParser {
    constructor() {
        this.fields = [];
        this.filter = [];
        this.or = [];
        this.join = [];
        this.sort = [];
    }
    get options() {
        return request_query_builder_1.RequestQueryBuilder._options;
    }
    parse(query) {
        if (util_1.isObject(query)) {
            const paramNames = util_1.getKeys(query);
            if (util_1.hasLength(paramNames)) {
                this._query = query;
                this._paramNames = paramNames;
                this.fields = this.parseParam('fields', this.fieldsParser.bind(this))[0] || [];
                this.filter = this.parseParam('filter', this.conditionParser.bind(this, 'filter'));
                this.or = this.parseParam('or', this.conditionParser.bind(this, 'or'));
                this.join = this.parseParam('join', this.joinParser.bind(this));
                this.sort = this.parseParam('sort', this.sortParser.bind(this));
                this.limit = this.parseParam('limit', this.numericParser.bind(this, 'limit'))[0];
                this.offset = this.parseParam('offset', this.numericParser.bind(this, 'offset'))[0];
                this.page = this.parseParam('page', this.numericParser.bind(this, 'page'))[0];
                this.cache = this.parseParam('cache', this.numericParser.bind(this, 'cache'))[0];
            }
        }
        return this;
    }
    getParamNames(type) {
        return this._paramNames.filter((p) => this.options.paramNamesMap[type].some((m) => m === p));
    }
    getParamValues(value, parser) {
        if (util_1.isStringFull(value)) {
            return [parser.call(this, value)];
        }
        if (util_1.isArrayFull(value)) {
            return value.map((val) => parser(val));
        }
        return [];
    }
    parseParam(type, parser) {
        const param = this.getParamNames(type);
        if (util_1.isArrayFull(param)) {
            return param.reduce((a, name) => [...a, ...this.getParamValues(this._query[name], parser)], []);
        }
        return [];
    }
    parseValue(val) {
        try {
            const parsed = JSON.parse(val);
            if (util_1.isObject(parsed)) {
                return val;
            }
            return parsed;
        }
        catch (ignored) {
            return val;
        }
    }
    parseValues(vals) {
        if (util_1.isArrayFull(vals)) {
            return vals.map((v) => this.parseValue(v));
        }
        else {
            return this.parseValue(vals);
        }
    }
    fieldsParser(data) {
        return data.split(this.options.delimStr);
    }
    conditionParser(cond, data) {
        const isArrayValue = ['in', 'notin', 'between'];
        const isEmptyValue = ['isnull', 'notnull'];
        const param = data.split(this.options.delim);
        const field = param[0];
        const operator = param[1];
        let value = param[2] || '';
        if (isArrayValue.some((name) => name === operator)) {
            value = value.split(this.options.delimStr);
        }
        value = this.parseValues(value);
        if (!util_1.hasLength(value) && !isEmptyValue.some((name) => name === operator)) {
            throw new exceptions_1.RequestQueryException(`Invalid ${cond} value`);
        }
        const condition = { field, operator, value };
        request_query_validator_1.validateCondition(condition, cond);
        return condition;
    }
    joinParser(data) {
        const param = data.split(this.options.delim);
        const join = {
            field: param[0],
            select: util_1.isStringFull(param[1]) ? param[1].split(this.options.delimStr) : undefined,
        };
        request_query_validator_1.validateJoin(join);
        return join;
    }
    sortParser(data) {
        const param = data.split(this.options.delimStr);
        const sort = {
            field: param[0],
            order: param[1],
        };
        request_query_validator_1.validateSort(sort);
        return sort;
    }
    numericParser(num, data) {
        const val = this.parseValue(data);
        request_query_validator_1.validateNumeric(val, num);
        return val;
    }
}
exports.RequestQueryParser = RequestQueryParser;
//# sourceMappingURL=request-query.parser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@nestjsx/util");
const exceptions_1 = require("./exceptions");
const request_query_builder_1 = require("./request-query.builder");
const request_query_validator_1 = require("./request-query.validator");
class RequestQueryParser {
    constructor() {
        this.fields = [];
        this.paramsFilter = [];
        this.filter = [];
        this.or = [];
        this.join = [];
        this.sort = [];
    }
    get _options() {
        return request_query_builder_1.RequestQueryBuilder.getOptions();
    }
    static create() {
        return new RequestQueryParser();
    }
    getParsed() {
        return {
            fields: this.fields,
            paramsFilter: this.paramsFilter,
            filter: this.filter,
            or: this.or,
            join: this.join,
            sort: this.sort,
            limit: this.limit,
            offset: this.offset,
            page: this.page,
            cache: this.cache,
        };
    }
    parseQuery(query) {
        if (util_1.isObject(query)) {
            const paramNames = util_1.objKeys(query);
            if (util_1.hasLength(paramNames)) {
                this._query = query;
                this._paramNames = paramNames;
                this.fields =
                    this.parseQueryParam('fields', this.fieldsParser.bind(this))[0] || [];
                this.filter = this.parseQueryParam('filter', this.conditionParser.bind(this, 'filter'));
                this.or = this.parseQueryParam('or', this.conditionParser.bind(this, 'or'));
                this.join = this.parseQueryParam('join', this.joinParser.bind(this));
                this.sort = this.parseQueryParam('sort', this.sortParser.bind(this));
                this.limit = this.parseQueryParam('limit', this.numericParser.bind(this, 'limit'))[0];
                this.offset = this.parseQueryParam('offset', this.numericParser.bind(this, 'offset'))[0];
                this.page = this.parseQueryParam('page', this.numericParser.bind(this, 'page'))[0];
                this.cache = this.parseQueryParam('cache', this.numericParser.bind(this, 'cache'))[0];
            }
        }
        return this;
    }
    parseParams(params, options) {
        if (util_1.isObject(params)) {
            const paramNames = util_1.objKeys(params);
            if (util_1.hasLength(paramNames)) {
                this._params = params;
                this._paramsOptions = options;
                this.paramsFilter = paramNames.map((name) => this.paramParser(name));
            }
        }
        return this;
    }
    getParamNames(type) {
        return this._paramNames.filter((p) => this._options.paramNamesMap[type].some((m) => m === p));
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
    parseQueryParam(type, parser) {
        const param = this.getParamNames(type);
        if (util_1.isArrayFull(param)) {
            return param.reduce((a, name) => [...a, ...this.getParamValues(this._query[name], parser)], []);
        }
        return [];
    }
    parseValue(val) {
        try {
            const parsed = JSON.parse(val);
            if (!util_1.isDate(parsed) && util_1.isObject(parsed)) {
                return val;
            }
            return parsed;
        }
        catch (ignored) {
            if (util_1.isDateString(val)) {
                return new Date(val);
            }
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
        return data.split(this._options.delimStr);
    }
    conditionParser(cond, data) {
        const isArrayValue = ['in', 'notin', 'between'];
        const isEmptyValue = ['isnull', 'notnull'];
        const param = data.split(this._options.delim);
        const field = param[0];
        const operator = param[1];
        let value = param[2] || '';
        if (isArrayValue.some((name) => name === operator)) {
            value = value.split(this._options.delimStr);
        }
        value = this.parseValues(value);
        if (!isEmptyValue.some((name) => name === operator) && !util_1.hasValue(value)) {
            throw new exceptions_1.RequestQueryException(`Invalid ${cond} value`);
        }
        const condition = { field, operator, value };
        request_query_validator_1.validateCondition(condition, cond);
        return condition;
    }
    joinParser(data) {
        const param = data.split(this._options.delim);
        const join = {
            field: param[0],
            select: util_1.isStringFull(param[1]) ? param[1].split(this._options.delimStr) : undefined,
        };
        request_query_validator_1.validateJoin(join);
        return join;
    }
    sortParser(data) {
        const param = data.split(this._options.delimStr);
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
    paramParser(name) {
        request_query_validator_1.validateParamOption(this._paramsOptions, name);
        const option = this._paramsOptions[name];
        const value = this.parseValue(this._params[name]);
        switch (option.type) {
            case 'number':
                request_query_validator_1.validateNumeric(value, `param ${name}`);
                break;
            case 'uuid':
                request_query_validator_1.validateUUID(value, name);
                break;
            default:
                break;
        }
        return { field: option.field, operator: 'eq', value };
    }
}
exports.RequestQueryParser = RequestQueryParser;
//# sourceMappingURL=request-query.parser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("@nestjsx/util");
const request_query_validator_1 = require("./request-query.validator");
class RequestQueryBuilder {
    constructor() {
        this._fields = [];
        this._filter = [];
        this._or = [];
        this._join = [];
        this._sort = [];
    }
    static setOptions(options) {
        RequestQueryBuilder._options = Object.assign({}, RequestQueryBuilder._options, options, { paramNamesMap: Object.assign({}, RequestQueryBuilder._options.paramNamesMap, (options.paramNamesMap ? options.paramNamesMap : {})) });
    }
    static create() {
        return new RequestQueryBuilder();
    }
    get options() {
        return RequestQueryBuilder._options;
    }
    query() {
        this.queryString = (this.getFields() +
            this.getCondition('filter') +
            this.getCondition('or') +
            this.getJoin() +
            this.getSort() +
            this.getNumeric('limit') +
            this.getNumeric('offset') +
            this.getNumeric('page') +
            this.getNumeric('cache')).slice(0, -1);
        return this.queryString;
    }
    select(fields) {
        request_query_validator_1.validateFields(fields);
        this._fields = fields;
        return this;
    }
    setFilter(filter) {
        request_query_validator_1.validateCondition(filter, 'filter');
        this._filter.push(filter);
        return this;
    }
    setOr(or) {
        request_query_validator_1.validateCondition(or, 'or');
        this._or.push(or);
        return this;
    }
    setJoin(join) {
        request_query_validator_1.validateJoin(join);
        this._join.push(join);
        return this;
    }
    sortBy(sort) {
        request_query_validator_1.validateSort(sort);
        this._sort.push(sort);
        return this;
    }
    setLimit(limit) {
        request_query_validator_1.validateNumeric(limit, 'limit');
        this._limit = limit;
        return this;
    }
    setOffset(offset) {
        request_query_validator_1.validateNumeric(offset, 'offset');
        this._offset = offset;
        return this;
    }
    setPage(page) {
        request_query_validator_1.validateNumeric(page, 'page');
        this._page = page;
        return this;
    }
    resetCache() {
        this._cache = 0;
        return this;
    }
    getParamName(param) {
        return this.options.paramNamesMap[param][0];
    }
    getFields() {
        if (!util_1.hasLength(this._fields)) {
            return '';
        }
        const param = this.getParamName('fields');
        const value = this._fields.join(this.options.delimStr);
        return `${param}=${value}&`;
    }
    getCondition(cond) {
        if (!util_1.hasLength(this[`_${cond}`])) {
            return '';
        }
        const param = this.getParamName(cond);
        const d = this.options.delim;
        return (this[`_${cond}`]
            .map((f) => `${param}=${f.field}${d}${f.operator}${f.value ? d + f.value : ''}`)
            .join('&') + '&');
    }
    getJoin() {
        if (!util_1.hasLength(this._join)) {
            return '';
        }
        const param = this.getParamName('join');
        const d = this.options.delim;
        const ds = this.options.delimStr;
        return (this._join
            .map((j) => `${param}=${j.field}${util_1.isArrayFull(j.select) ? d + j.select.join(ds) : ''}`)
            .join('&') + '&');
    }
    getSort() {
        if (!util_1.hasLength(this._sort)) {
            return '';
        }
        const param = this.getParamName('sort');
        const ds = this.options.delimStr;
        return (this._sort.map((s) => `${param}=${s.field}${ds}${s.order}`).join('&') +
            '&');
    }
    getNumeric(num) {
        if (util_1.isNil(this[`_${num}`])) {
            return '';
        }
        const param = this.getParamName(num);
        const value = this[`_${num}`];
        return `${param}=${value}&`;
    }
}
RequestQueryBuilder._options = {
    delim: '||',
    delimStr: ',',
    paramNamesMap: {
        fields: ['fields', 'select'],
        filter: ['filter[]', 'filter'],
        or: ['or[]', 'or'],
        join: ['join[]', 'join'],
        sort: ['sort[]', 'sort'],
        limit: ['per_page', 'limit'],
        offset: ['offset'],
        page: ['page'],
        cache: ['cache'],
    },
};
exports.RequestQueryBuilder = RequestQueryBuilder;
//# sourceMappingURL=request-query.builder.js.map
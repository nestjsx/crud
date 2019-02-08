"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const class_transformer_1 = require("class-transformer");
const restful_service_class_1 = require("../classes/restful-service.class");
const utils_1 = require("../utils");
class RepositoryService extends restful_service_class_1.RestfulService {
    constructor(repo, type) {
        super();
        this.repo = repo;
        this.type = type;
        this.options = {};
        this.entityColumnsHash = {};
        this.entityRelationsHash = {};
        this.onInitMapEntityColumns();
        this.onInitMapRelations();
    }
    get entityType() {
        return this.repo.target;
    }
    get alias() {
        return this.type.name;
    }
    getMany(query = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongooseQuery = yield this.buildQuery(query, options);
            return this.repo
                .find(mongooseQuery.find)
                .select(mongooseQuery.select);
            ;
        });
    }
    getOne(id, { fields, join, cache } = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getOneOrFail({
                filter: [{ field: 'id', operator: 'eq', value: id }],
                fields,
                join,
                cache,
            }, options);
        });
    }
    createOne(data, paramsFilter = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.plainToClass(data, paramsFilter);
            if (!entity) {
                this.throwBadRequestException(`Empty data. Nothing to save.`);
            }
            return new this.repo(entity).save();
        });
    }
    createMany(data, paramsFilter = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.bulk || !data.bulk.length) {
                this.throwBadRequestException(`Empty data. Nothing to save.`);
            }
            const bulk = data.bulk
                .map((one) => this.plainToClass(one, paramsFilter))
                .filter((d) => shared_utils_1.isObject(d));
            if (!bulk.length) {
                this.throwBadRequestException(`Empty data. Nothing to save.`);
            }
            return this.repo.save(bulk, { chunk: 50 });
        });
    }
    updateOne(id, data, paramsFilter = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.getOneOrFail({
                filter: [{ field: 'id', operator: 'eq', value: id }, ...paramsFilter],
            });
            if (data.$push) {
                Object.keys(data.$push)
                    .map((key) => {
                    if (!item[key]) {
                        item[key] = [];
                    }
                    item[key].push(data.$push[key]);
                });
            }
            const entity = this.plainToClass(data, paramsFilter);
            Object.assign(item, entity);
            return item.save();
        });
    }
    deleteOne(id, paramsFilter = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.getOneOrFail({
                filter: [{ field: 'id', operator: 'eq', value: id }, ...paramsFilter],
            });
            const deleted = yield this.repo.remove(found);
        });
    }
    getOneOrFail({ filter, fields, join, cache } = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryMongoose = yield this.buildQuery({ filter, fields, join, cache }, options, false);
            const found = yield this.repo.findOne(queryMongoose.find)
                .select(queryMongoose.select);
            if (!found) {
                this.throwNotFoundException(this.alias);
            }
            return found;
        });
    }
    buildQuery(query, options = {}, many = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const mergedOptions = Object.assign({}, this.options, options);
            const select = this.getSelect(query, mergedOptions);
            const model = this.repo;
            let find = {};
            let limit;
            let skip;
            let sort;
            const hasFilter = utils_1.isArrayFull(query.filter);
            const hasOr = utils_1.isArrayFull(query.or);
            if (hasFilter) {
                find = query.filter
                    .map((field) => this.setFindField(field))
                    .reduce((prev, curr) => new Object(Object.assign({}, prev, curr)), find);
                console.log('find', find);
            }
            if (hasOr) {
                console.error('"Or" is not supported');
            }
            if (many) {
                sort = this.getSort(query, mergedOptions);
                limit = this.getTake(query, mergedOptions);
                skip = this.getSkip(query, limit);
            }
            return {
                select,
                find,
                limit,
                sort,
            };
        });
    }
    plainToClass(data, paramsFilter = []) {
        if (!shared_utils_1.isObject(data)) {
            return undefined;
        }
        if (paramsFilter.length) {
            for (let filter of paramsFilter) {
                data[filter.field] = filter.value;
            }
        }
        if (!Object.keys(data).length) {
            return undefined;
        }
        return class_transformer_1.plainToClass(this.entityType, data);
    }
    onInitMapEntityColumns() {
        this.entityColumns = this.type.columns.map((prop) => {
            this.entityColumnsHash[prop.propertyName] = true;
            return prop.propertyName;
        });
    }
    onInitMapRelations() {
        console.log(this.type);
    }
    hasColumn(column) {
        return this.entityColumnsHash[column];
    }
    validateHasColumn(column) {
        if (!this.hasColumn(column.split('.')[0])) {
            this.throwBadRequestException(`Invalid column name '${column}'`);
        }
    }
    getAllowedColumns(columns, options) {
        return (!options.exclude || !options.exclude.length) &&
            (!options.allow || !options.allow.length)
            ? columns
            : columns.filter((column) => (options.exclude && options.exclude.length
                ? !options.exclude.some((col) => col === column)
                : true) &&
                (options.allow && options.allow.length
                    ? options.allow.some((col) => col === column)
                    : true));
    }
    setFindField(cond) {
        this.validateHasColumn(cond.field);
        const obj = this.mapOperatorsToQuery(cond, cond.value);
        return obj;
    }
    getSelect(query, options) {
        const allowed = this.getAllowedColumns(this.entityColumns, options);
        console.log(allowed);
        const columns = query.fields && query.fields.length
            ? query.fields.filter((field) => allowed.some((col) => field === col))
            : allowed;
        const select = [
            ...(options.persist && options.persist.length ? options.persist : []),
            ...columns,
            'id',
        ].map((col) => new Object({ [col]: true }))
            .reduce((prev, curr) => Object.assign(prev, curr), {});
        return select;
    }
    getSkip(query, take) {
        return query.page && take ? take * (query.page - 1) : query.offset ? query.offset : 0;
    }
    getTake(query, options) {
        if (query.limit) {
            return options.maxLimit
                ? query.limit <= options.maxLimit
                    ? query.limit
                    : options.maxLimit
                : query.limit;
        }
        if (options.limit) {
            return options.maxLimit
                ? options.limit <= options.maxLimit
                    ? options.limit
                    : options.maxLimit
                : options.limit;
        }
        return options.maxLimit ? options.maxLimit : 0;
    }
    getSort(query, options) {
        return query.sort && query.sort.length
            ? this.mapSort(query.sort)
            : options.sort && options.sort.length
                ? this.mapSort(options.sort)
                : {};
    }
    mapSort(sort) {
        let params = {};
        for (let i = 0; i < sort.length; i++) {
            this.validateHasColumn(sort[i].field);
            params[`${this.alias}.${sort[i].field}`] = sort[i].order;
        }
        return params;
    }
    mapOperatorsToQuery(cond, param) {
        const field = cond.field;
        let obj = {};
        if (field === 'id') {
            return { _id: utils_1.toObjectId(param) };
        }
        switch (cond.operator) {
            case 'eq':
                obj = ({ [field]: { $eq: param } });
                break;
            case 'ne':
                obj = ({ [field]: { $ne: param } });
                break;
            case 'gt':
                obj = ({ [field]: { $eq: param } });
                break;
            case 'lt':
                obj = ({ [field]: { $eq: param } });
                break;
            case 'gte':
                obj = ({ [field]: { $eq: param } });
                break;
            case 'lte':
                obj = ({ [field]: { $eq: param } });
                break;
            case 'starts':
                obj = ({ [field]: { $regex: '^' + param } });
                break;
            case 'ends':
                obj = ({ [field]: { $regex: param + '&' } });
                break;
            case 'cont':
                obj = ({ [field]: { $text: { $search: param } } });
                break;
            case 'excl':
                obj = ({ [field]: { $text: { $search: '-' + param + '' } } });
                break;
            case 'in':
                obj = ({ [field]: { $in: [param] } });
                break;
            case 'notin':
                obj = ({ [field]: { $in: [param] } });
                break;
            case 'isnull':
                obj = ({ [field]: null });
                break;
            case 'notnull':
                obj = ({ [field]: { $exists: false } });
                break;
            case 'between':
                this.throwBadRequestException(`Is not supported`);
                break;
            default:
                obj = ({ [field]: param });
                break;
        }
        return obj;
    }
}
exports.RepositoryService = RepositoryService;
//# sourceMappingURL=repository-service.class.js.map
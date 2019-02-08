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
const typeorm_1 = require("typeorm");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const class_transformer_1 = require("class-transformer");
const restful_service_class_1 = require("../classes/restful-service.class");
const utils_1 = require("../utils");
class RepositoryService extends restful_service_class_1.RestfulService {
    constructor(repo) {
        super();
        this.repo = repo;
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
        return this.repo.metadata.targetName;
    }
    getMany(query = {}, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = yield this.buildQuery(query, options);
            return builder.getManyAndCount();
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
            return this.repo.save(entity);
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
            const found = yield this.getOneOrFail({
                filter: [{ field: 'id', operator: 'eq', value: id }, ...paramsFilter],
            });
            data['id'] = id;
            const entity = this.plainToClass(data, paramsFilter);
            return this.repo.save(entity);
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
            const builder = yield this.buildQuery({ filter, fields, join, cache }, options, false);
            const found = yield builder.getOne();
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
            const builder = this.repo.createQueryBuilder(this.alias);
            builder.select(select);
            if (utils_1.isArrayFull(mergedOptions.filter)) {
                for (let i = 0; i < mergedOptions.filter.length; i++) {
                    this.setAndWhere(mergedOptions.filter[i], `mergedOptions${i}`, builder);
                }
            }
            const hasFilter = utils_1.isArrayFull(query.filter);
            const hasOr = utils_1.isArrayFull(query.or);
            if (hasFilter && hasOr) {
                if (query.filter.length === 1 && query.or.length === 1) {
                    this.setOrWhere(query.filter[0], `filter0`, builder);
                    this.setOrWhere(query.or[0], `or0`, builder);
                }
                else if (query.filter.length === 1) {
                    this.setAndWhere(query.filter[0], `filter0`, builder);
                    builder.orWhere(new typeorm_1.Brackets((qb) => {
                        for (let i = 0; i < query.or.length; i++) {
                            this.setAndWhere(query.or[i], `or${i}`, qb);
                        }
                    }));
                }
                else if (query.or.length === 1) {
                    this.setAndWhere(query.or[0], `or0`, builder);
                    builder.orWhere(new typeorm_1.Brackets((qb) => {
                        for (let i = 0; i < query.filter.length; i++) {
                            this.setAndWhere(query.filter[i], `filter${i}`, qb);
                        }
                    }));
                }
                else {
                    builder.andWhere(new typeorm_1.Brackets((qb) => {
                        for (let i = 0; i < query.filter.length; i++) {
                            this.setAndWhere(query.filter[i], `filter${i}`, qb);
                        }
                    }));
                    builder.orWhere(new typeorm_1.Brackets((qb) => {
                        for (let i = 0; i < query.or.length; i++) {
                            this.setAndWhere(query.or[i], `or${i}`, qb);
                        }
                    }));
                }
            }
            else if (hasOr) {
                for (let i = 0; i < query.or.length; i++) {
                    this.setOrWhere(query.or[i], `or${i}`, builder);
                }
            }
            else if (hasFilter) {
                for (let i = 0; i < query.filter.length; i++) {
                    this.setAndWhere(query.filter[i], `filter${i}`, builder);
                }
            }
            if (utils_1.isArrayFull(query.join)) {
                const joinOptions = Object.assign({}, (this.options.join ? this.options.join : {}), (options.join ? options.join : {}));
                if (Object.keys(joinOptions).length) {
                    for (let i = 0; i < query.join.length; i++) {
                        this.setJoin(query.join[i], joinOptions, builder);
                    }
                }
            }
            if (many) {
                const sort = this.getSort(query, mergedOptions);
                builder.orderBy(sort);
                const take = this.getTake(query, mergedOptions);
                if (take) {
                    builder.take(take);
                }
                const skip = this.getSkip(query, take);
                if (skip) {
                    builder.skip(skip);
                }
            }
            if (query.cache === 0 &&
                this.repo.metadata.connection.queryResultCache &&
                this.repo.metadata.connection.queryResultCache.remove) {
                const cacheId = this.getCacheId(query, options);
                yield this.repo.metadata.connection.queryResultCache.remove([cacheId]);
            }
            if (mergedOptions.cache) {
                const cacheId = this.getCacheId(query, options);
                builder.cache(cacheId, mergedOptions.cache);
            }
            return builder;
        });
    }
    plainToClass(data, paramsFilter = []) {
        if (!shared_utils_1.isObject(data)) {
            return undefined;
        }
        if (paramsFilter.length) {
            for (const filter of paramsFilter) {
                data[filter.field] = filter.value;
            }
        }
        if (!Object.keys(data).length) {
            return undefined;
        }
        return class_transformer_1.plainToClass(this.entityType, data);
    }
    onInitMapEntityColumns() {
        this.entityColumns = this.repo.metadata.columns.map((prop) => {
            this.entityColumnsHash[prop.propertyName] = true;
            return prop.propertyName;
        });
    }
    onInitMapRelations() {
        this.entityRelationsHash = this.repo.metadata.relations.reduce((hash, curr) => (Object.assign({}, hash, { [curr.propertyName]: {
                name: curr.propertyName,
                type: this.getJoinType(curr.relationType),
                columns: curr.inverseEntityMetadata.columns.map((col) => col.propertyName),
                referencedColumn: (curr.joinColumns.length
                    ? curr.joinColumns[0]
                    : curr.inverseRelation.joinColumns[0]).referencedColumn.propertyName,
            } })), {});
    }
    getJoinType(relationType) {
        switch (relationType) {
            case 'many-to-one':
            case 'one-to-one':
                return 'innerJoin';
            default:
                return 'leftJoin';
        }
    }
    hasColumn(column) {
        return this.entityColumnsHash[column];
    }
    validateHasColumn(column) {
        if (!this.hasColumn(column)) {
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
    getRelationMetadata(field) {
        try {
            const fields = field.split('.');
            const target = fields[fields.length - 1];
            const paths = fields.slice(0, fields.length - 1);
            let relations = this.repo.metadata.relations;
            for (const propertyName of paths) {
                relations = relations.find(o => o.propertyName === propertyName).inverseEntityMetadata.relations;
            }
            const relation = relations.find(o => o.propertyName === target);
            relation.nestedRelation = `${fields[fields.length - 2]}.${target}`;
            return relation;
        }
        catch (e) {
            return null;
        }
    }
    setJoin(cond, joinOptions, builder) {
        if (this.entityRelationsHash[cond.field] === undefined && cond.field.includes('.')) {
            const curr = this.getRelationMetadata(cond.field);
            if (!curr) {
                this.entityRelationsHash[cond.field] = null;
                return true;
            }
            this.entityRelationsHash[cond.field] = {
                name: curr.propertyName,
                type: this.getJoinType(curr.relationType),
                columns: curr.inverseEntityMetadata.columns.map((col) => col.propertyName),
                referencedColumn: (curr.joinColumns.length
                    ? curr.joinColumns[0]
                    : curr.inverseRelation.joinColumns[0]).referencedColumn.propertyName,
                nestedRelation: curr.nestedRelation,
            };
        }
        if (cond.field && this.entityRelationsHash[cond.field] && joinOptions[cond.field]) {
            const relation = this.entityRelationsHash[cond.field];
            const options = joinOptions[cond.field];
            const allowed = this.getAllowedColumns(relation.columns, options);
            if (!allowed.length) {
                return true;
            }
            const columns = !cond.select || !cond.select.length
                ? allowed
                : cond.select.filter((col) => allowed.some((a) => a === col));
            const select = [
                relation.referencedColumn,
                ...(options.persist && options.persist.length ? options.persist : []),
                ...columns,
            ].map((col) => `${relation.name}.${col}`);
            const relationPath = relation.nestedRelation || `${this.alias}.${relation.name}`;
            builder[relation.type](relationPath, relation.name);
            builder.addSelect(select);
        }
        return true;
    }
    setAndWhere(cond, i, builder) {
        this.validateHasColumn(cond.field);
        const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i}`);
        builder.andWhere(str, params);
    }
    setOrWhere(cond, i, builder) {
        this.validateHasColumn(cond.field);
        const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i}`);
        builder.orWhere(str, params);
    }
    getCacheId(query, options) {
        return JSON.stringify({ query, options, cache: undefined });
    }
    getSelect(query, options) {
        const allowed = this.getAllowedColumns(this.entityColumns, options);
        const columns = query.fields && query.fields.length
            ? query.fields.filter((field) => allowed.some((col) => field === col))
            : allowed;
        const select = [
            ...(options.persist && options.persist.length ? options.persist : []),
            ...columns,
            'id',
        ].map((col) => `${this.alias}.${col}`);
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
        const params = {};
        for (let i = 0; i < sort.length; i++) {
            this.validateHasColumn(sort[i].field);
            params[`${this.alias}.${sort[i].field}`] = sort[i].order;
        }
        return params;
    }
    mapOperatorsToQuery(cond, param) {
        const field = `${this.alias}.${cond.field}`;
        let str;
        let params;
        switch (cond.operator) {
            case 'eq':
                str = `${field} = :${param}`;
                break;
            case 'ne':
                str = `${field} != :${param}`;
                break;
            case 'gt':
                str = `${field} > :${param}`;
                break;
            case 'lt':
                str = `${field} < :${param}`;
                break;
            case 'gte':
                str = `${field} >= :${param}`;
                break;
            case 'lte':
                str = `${field} <= :${param}`;
                break;
            case 'starts':
                str = `${field} LIKE :${param}`;
                params = { [param]: `${cond.value}%` };
                break;
            case 'ends':
                str = `${field} LIKE :${param}`;
                params = { [param]: `%${cond.value}` };
                break;
            case 'cont':
                str = `${field} LIKE :${param}`;
                params = { [param]: `%${cond.value}%` };
                break;
            case 'excl':
                str = `${field} NOT LIKE :${param}`;
                params = { [param]: `%${cond.value}%` };
                break;
            case 'in':
                if (!Array.isArray(cond.value) || !cond.value.length) {
                    this.throwBadRequestException(`Invalid column '${cond.field}' value`);
                }
                str = `${field} IN (:...${param})`;
                break;
            case 'notin':
                if (!Array.isArray(cond.value) || !cond.value.length) {
                    this.throwBadRequestException(`Invalid column '${cond.field}' value`);
                }
                str = `${field} NOT IN (:...${param})`;
                break;
            case 'isnull':
                str = `${field} IS NULL`;
                params = {};
                break;
            case 'notnull':
                str = `${field} IS NOT NULL`;
                params = {};
                break;
            case 'between':
                if (!Array.isArray(cond.value) || !cond.value.length || cond.value.length !== 2) {
                    this.throwBadRequestException(`Invalid column '${cond.field}' value`);
                }
                str = `${field} BETWEEN :${param}0 AND :${param}1`;
                params = {
                    [`${param}0`]: cond.value[0],
                    [`${param}1`]: cond.value[1],
                };
                break;
            default:
                str = `${field} = :${param}`;
                break;
        }
        if (typeof params === 'undefined') {
            params = { [param]: cond.value };
        }
        return { str, params };
    }
}
exports.RepositoryService = RepositoryService;
//# sourceMappingURL=repository-service.class.js.map
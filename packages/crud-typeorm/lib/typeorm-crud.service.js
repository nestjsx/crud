"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const services_1 = require("@nestjsx/crud/lib/services");
const util_1 = require("@nestjsx/util");
class TypeOrmCrudService extends services_1.CrudService {
    constructor(repo) {
        super();
        this.repo = repo;
        this.entityColumnsHash = {};
        this.entityRelationsHash = {};
        this.onInitMapEntityColumns();
        this.onInitMapRelations();
    }
    get findOne() {
        return this.repo.findOne.bind(this.repo);
    }
    get find() {
        return this.repo.find.bind(this.repo);
    }
    get entityType() {
        return this.repo.target;
    }
    get alias() {
        return this.repo.metadata.targetName;
    }
    async getMany(req) {
        const { parsed, options } = req;
        const builder = await this.createBuilder(parsed, options);
        if (this.decidePagination(parsed, options)) {
            const [data, total] = await builder.getManyAndCount();
            const limit = builder.expressionMap.take;
            const offset = builder.expressionMap.skip;
            return this.createPageInfo(data, total, limit, offset);
        }
        return builder.getMany();
    }
    async getOne(req) {
        return this.getOneOrFail(req);
    }
    async createOne(req, dto) {
        const entity = this.prepareEntityBeforeSave(dto, req.parsed.paramsFilter);
        if (!entity) {
            this.throwBadRequestException(`Empty data. Nothing to save.`);
        }
        return this.repo.save(entity);
    }
    async createMany(req, dto) {
        if (!util_1.isObject(dto) || !util_1.isArrayFull(dto.bulk)) {
            this.throwBadRequestException(`Empty data. Nothing to save.`);
        }
        const bulk = dto.bulk
            .map((one) => this.prepareEntityBeforeSave(one, req.parsed.paramsFilter))
            .filter((d) => !util_1.isUndefined(d));
        if (!util_1.hasLength(bulk)) {
            this.throwBadRequestException(`Empty data. Nothing to save.`);
        }
        return this.repo.save(bulk, { chunk: 50 });
    }
    async updateOne(req, dto) {
        const found = await this.getOneOrFail(req);
        if (util_1.hasLength(req.parsed.paramsFilter) &&
            !req.options.routes.updateOneBase.allowParamsOverride) {
            for (const filter of req.parsed.paramsFilter) {
                dto[filter.field] = filter.value;
            }
        }
        return this.repo.save(Object.assign({}, found, dto));
    }
    async deleteOne(req) {
        const found = await this.getOneOrFail(req);
        const deleted = await this.repo.remove(found);
        if (req.options.routes.deleteOneBase.returnDeleted) {
            for (const filter of req.parsed.paramsFilter) {
                deleted[filter.field] = filter.value;
            }
            return deleted;
        }
    }
    decidePagination(parsed, options) {
        return ((Number.isFinite(parsed.page) || Number.isFinite(parsed.offset)) &&
            !!this.getTake(parsed, options.query));
    }
    async createBuilder(parsed, options, many = true) {
        const builder = this.repo.createQueryBuilder(this.alias);
        const select = this.getSelect(parsed, options.query);
        builder.select(select);
        if (util_1.isArrayFull(options.query.filter)) {
            for (let i = 0; i < options.query.filter.length; i++) {
                this.setAndWhere(options.query.filter[i], `optionsFilter${i}`, builder);
            }
        }
        const filters = [...parsed.paramsFilter, ...parsed.filter];
        const hasFilter = util_1.isArrayFull(filters);
        const hasOr = util_1.isArrayFull(parsed.or);
        if (hasFilter && hasOr) {
            if (filters.length === 1 && parsed.or.length === 1) {
                this.setOrWhere(filters[0], `filter0`, builder);
                this.setOrWhere(parsed.or[0], `or0`, builder);
            }
            else if (filters.length === 1) {
                this.setAndWhere(filters[0], `filter0`, builder);
                builder.orWhere(new typeorm_1.Brackets((qb) => {
                    for (let i = 0; i < parsed.or.length; i++) {
                        this.setAndWhere(parsed.or[i], `or${i}`, qb);
                    }
                }));
            }
            else if (parsed.or.length === 1) {
                this.setAndWhere(parsed.or[0], `or0`, builder);
                builder.orWhere(new typeorm_1.Brackets((qb) => {
                    for (let i = 0; i < filters.length; i++) {
                        this.setAndWhere(filters[i], `filter${i}`, qb);
                    }
                }));
            }
            else {
                builder.andWhere(new typeorm_1.Brackets((qb) => {
                    for (let i = 0; i < filters.length; i++) {
                        this.setAndWhere(filters[i], `filter${i}`, qb);
                    }
                }));
                builder.orWhere(new typeorm_1.Brackets((qb) => {
                    for (let i = 0; i < parsed.or.length; i++) {
                        this.setAndWhere(parsed.or[i], `or${i}`, qb);
                    }
                }));
            }
        }
        else if (hasOr) {
            for (let i = 0; i < parsed.or.length; i++) {
                this.setOrWhere(parsed.or[i], `or${i}`, builder);
            }
        }
        else if (hasFilter) {
            for (let i = 0; i < filters.length; i++) {
                this.setAndWhere(filters[i], `filter${i}`, builder);
            }
        }
        const joinOptions = options.query.join || {};
        const allowedJoins = util_1.objKeys(joinOptions);
        if (util_1.hasLength(allowedJoins)) {
            let eagerJoins = {};
            for (let i = 0; i < allowedJoins.length; i++) {
                if (joinOptions[allowedJoins[i]].eager) {
                    const cond = parsed.join.find((j) => j && j.field === allowedJoins[i]) || {
                        field: allowedJoins[i],
                    };
                    this.setJoin(cond, joinOptions, builder);
                    eagerJoins[allowedJoins[i]] = true;
                }
            }
            if (util_1.isArrayFull(parsed.join)) {
                for (let i = 0; i < parsed.join.length; i++) {
                    if (!eagerJoins[parsed.join[i].field]) {
                        this.setJoin(parsed.join[i], joinOptions, builder);
                    }
                }
            }
        }
        if (many) {
            const sort = this.getSort(parsed, options.query);
            builder.orderBy(sort);
            const take = this.getTake(parsed, options.query);
            if (isFinite(take)) {
                builder.take(take);
            }
            const skip = this.getSkip(parsed, take);
            if (isFinite(skip)) {
                builder.skip(skip);
            }
        }
        if (options.query.cache && parsed.cache !== 0) {
            builder.cache(builder.getQueryAndParameters(), options.query.cache);
        }
        return builder;
    }
    onInitMapEntityColumns() {
        this.entityColumns = this.repo.metadata.columns.map((prop) => {
            this.entityColumnsHash[prop.propertyName] = true;
            return prop.propertyName;
        });
        this.entityPrimaryColumns = this.repo.metadata.columns
            .filter((prop) => prop.isPrimary)
            .map((prop) => prop.propertyName);
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
    async getOneOrFail(req) {
        const { parsed, options } = req;
        const builder = await this.createBuilder(parsed, options);
        const found = await builder.getOne();
        if (!found) {
            this.throwNotFoundException(this.alias);
        }
        return found;
    }
    prepareEntityBeforeSave(dto, paramsFilter) {
        if (!util_1.isObject(dto)) {
            return undefined;
        }
        if (util_1.hasLength(paramsFilter)) {
            for (const filter of paramsFilter) {
                dto[filter.field] = filter.value;
            }
        }
        if (!util_1.hasLength(util_1.objKeys(dto))) {
            return undefined;
        }
        return dto instanceof this.entityType ? dto : class_transformer_1.plainToClass(this.entityType, dto);
    }
    hasColumn(column) {
        return this.entityColumnsHash[column];
    }
    hasRelation(column) {
        return this.entityRelationsHash[column];
    }
    validateHasColumn(column) {
        if (column.indexOf('.') !== -1) {
            const nests = column.split('.');
            if (nests.length > 2) {
                this.throwBadRequestException('Too many nested levels! ' +
                    `Usage: '[join=<other-relation>&]join=[<other-relation>.]<relation>&filter=<relation>.<field>||op||val'`);
            }
            let relation;
            [relation, column] = nests;
            if (!this.hasRelation(relation)) {
                this.throwBadRequestException(`Invalid relation name '${relation}'`);
            }
            const noColumn = !this.entityRelationsHash[relation].columns.find((o) => o === column);
            if (noColumn) {
                this.throwBadRequestException(`Invalid column name '${column}' for relation '${relation}'`);
            }
        }
        else {
            if (!this.hasColumn(column)) {
                this.throwBadRequestException(`Invalid column name '${column}'`);
            }
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
                relations = relations.find((o) => o.propertyName === propertyName)
                    .inverseEntityMetadata.relations;
            }
            const relation = relations.find((o) => o.propertyName === target);
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
    getSelect(query, options) {
        const allowed = this.getAllowedColumns(this.entityColumns, options);
        const columns = query.fields && query.fields.length
            ? query.fields.filter((field) => allowed.some((col) => field === col))
            : allowed;
        const select = [
            ...(options.persist && options.persist.length ? options.persist : []),
            ...columns,
            ...this.entityPrimaryColumns,
        ].map((col) => `${this.alias}.${col}`);
        return select;
    }
    getSkip(query, take) {
        return query.page && take
            ? take * (query.page - 1)
            : query.offset
                ? query.offset
                : null;
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
        return options.maxLimit ? options.maxLimit : null;
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
        const field = cond.field.indexOf('.') === -1 ? `${this.alias}.${cond.field}` : cond.field;
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
exports.TypeOrmCrudService = TypeOrmCrudService;
//# sourceMappingURL=typeorm-crud.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crud_1 = require("@nestjsx/crud");
const util_1 = require("@nestjsx/util");
const o0_1 = require("@zmotivat0r/o0");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
class TypeOrmCrudService extends crud_1.CrudService {
    constructor(repo) {
        super();
        this.repo = repo;
        this.entityHasDeleteColumn = false;
        this.entityColumnsHash = {};
        this.entityRelationsHash = new Map();
        this.sqlInjectionRegEx = [
            /(%27)|(\')|(--)|(%23)|(#)/gi,
            /((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))/gi,
            /w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))/gi,
            /((%27)|(\'))union/gi,
        ];
        this.dbName = this.repo.metadata.connection.options.type;
        this.onInitMapEntityColumns();
    }
    get findOne() {
        return this.repo.findOne.bind(this.repo);
    }
    get find() {
        return this.repo.find.bind(this.repo);
    }
    get count() {
        return this.repo.count.bind(this.repo);
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
        return this.doGetMany(builder, parsed, options);
    }
    async getOne(req) {
        return this.getOneOrFail(req);
    }
    async createOne(req, dto) {
        const { returnShallow } = req.options.routes.createOneBase;
        const entity = this.prepareEntityBeforeSave(dto, req.parsed);
        if (!entity) {
            this.throwBadRequestException(`Empty data. Nothing to save.`);
        }
        const saved = await this.repo.save(entity);
        if (returnShallow) {
            return saved;
        }
        else {
            const primaryParams = this.getPrimaryParams(req.options);
            if (!primaryParams.length && primaryParams.some((p) => util_1.isNil(saved[p]))) {
                return saved;
            }
            else {
                req.parsed.search = primaryParams.reduce((acc, p) => ({ ...acc, [p]: saved[p] }), {});
                return this.getOneOrFail(req);
            }
        }
    }
    async createMany(req, dto) {
        if (!util_1.isObject(dto) || !util_1.isArrayFull(dto.bulk)) {
            this.throwBadRequestException(`Empty data. Nothing to save.`);
        }
        const bulk = dto.bulk
            .map((one) => this.prepareEntityBeforeSave(one, req.parsed))
            .filter((d) => !util_1.isUndefined(d));
        if (!util_1.hasLength(bulk)) {
            this.throwBadRequestException(`Empty data. Nothing to save.`);
        }
        return this.repo.save(bulk, { chunk: 50 });
    }
    async updateOne(req, dto) {
        const { allowParamsOverride, returnShallow } = req.options.routes.updateOneBase;
        const paramsFilters = this.getParamFilters(req.parsed);
        const found = await this.getOneOrFail(req, returnShallow);
        const toSave = !allowParamsOverride
            ? { ...found, ...dto, ...paramsFilters, ...req.parsed.authPersist }
            : { ...found, ...dto, ...req.parsed.authPersist };
        const updated = await this.repo.save(class_transformer_1.plainToClass(this.entityType, toSave));
        if (returnShallow) {
            return updated;
        }
        else {
            req.parsed.paramsFilter.forEach((filter) => {
                filter.value = updated[filter.field];
            });
            return this.getOneOrFail(req);
        }
    }
    async recoverOne(req) {
        const found = await this.getOneOrFail(req, false, true);
        return this.repo.recover(found);
    }
    async replaceOne(req, dto) {
        const { allowParamsOverride, returnShallow } = req.options.routes.replaceOneBase;
        const paramsFilters = this.getParamFilters(req.parsed);
        const [_, found] = await o0_1.oO(this.getOneOrFail(req, returnShallow));
        const toSave = !allowParamsOverride
            ? { ...(found || {}), ...dto, ...paramsFilters, ...req.parsed.authPersist }
            : {
                ...(found || {}),
                ...paramsFilters,
                ...dto,
                ...req.parsed.authPersist,
            };
        const replaced = await this.repo.save(class_transformer_1.plainToClass(this.entityType, toSave));
        if (returnShallow) {
            return replaced;
        }
        else {
            const primaryParams = this.getPrimaryParams(req.options);
            if (!primaryParams.length) {
                return replaced;
            }
            req.parsed.search = primaryParams.reduce((acc, p) => ({ ...acc, [p]: replaced[p] }), {});
            return this.getOneOrFail(req);
        }
    }
    async deleteOne(req) {
        const { returnDeleted } = req.options.routes.deleteOneBase;
        const found = await this.getOneOrFail(req, returnDeleted);
        const toReturn = returnDeleted
            ? class_transformer_1.plainToClass(this.entityType, { ...found })
            : undefined;
        const deleted = req.options.query.softDelete === true
            ? await this.repo.softRemove(found)
            : await this.repo.remove(found);
        return toReturn;
    }
    getParamFilters(parsed) {
        let filters = {};
        if (util_1.hasLength(parsed.paramsFilter)) {
            for (const filter of parsed.paramsFilter) {
                filters[filter.field] = filter.value;
            }
        }
        return filters;
    }
    async createBuilder(parsed, options, many = true, withDeleted = false) {
        const builder = this.repo.createQueryBuilder(this.alias);
        const select = this.getSelect(parsed, options.query);
        builder.select(select);
        this.setSearchCondition(builder, parsed.search);
        const joinOptions = options.query.join || {};
        const allowedJoins = util_1.objKeys(joinOptions);
        if (util_1.hasLength(allowedJoins)) {
            const eagerJoins = {};
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
        if (this.entityHasDeleteColumn && options.query.softDelete) {
            if (parsed.includeDeleted === 1 || withDeleted) {
                builder.withDeleted();
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
    async doGetMany(builder, query, options) {
        if (this.decidePagination(query, options)) {
            const [data, total] = await builder.getManyAndCount();
            const limit = builder.expressionMap.take;
            const offset = builder.expressionMap.skip;
            return this.createPageInfo(data, total, limit || total, offset || 0);
        }
        return builder.getMany();
    }
    onInitMapEntityColumns() {
        this.entityColumns = this.repo.metadata.columns.map((prop) => {
            if (prop.embeddedMetadata) {
                this.entityColumnsHash[prop.propertyPath] = prop.databasePath;
                return prop.propertyPath;
            }
            this.entityColumnsHash[prop.propertyName] = prop.databasePath;
            return prop.propertyName;
        });
        this.entityPrimaryColumns = this.repo.metadata.columns
            .filter((prop) => prop.isPrimary)
            .map((prop) => prop.propertyName);
        this.entityHasDeleteColumn =
            this.repo.metadata.columns.filter((prop) => prop.isDeleteDate).length > 0;
    }
    async getOneOrFail(req, shallow = false, withDeleted = false) {
        const { parsed, options } = req;
        const builder = shallow
            ? this.repo.createQueryBuilder(this.alias)
            : await this.createBuilder(parsed, options, true, withDeleted);
        if (shallow) {
            this.setSearchCondition(builder, parsed.search);
        }
        const found = withDeleted
            ? await builder.withDeleted().getOne()
            : await builder.getOne();
        if (!found) {
            this.throwNotFoundException(this.alias);
        }
        return found;
    }
    prepareEntityBeforeSave(dto, parsed) {
        if (!util_1.isObject(dto)) {
            return undefined;
        }
        if (util_1.hasLength(parsed.paramsFilter)) {
            for (const filter of parsed.paramsFilter) {
                dto[filter.field] = filter.value;
            }
        }
        if (!util_1.hasLength(util_1.objKeys(dto))) {
            return undefined;
        }
        return dto instanceof this.entityType
            ? Object.assign(dto, parsed.authPersist)
            : class_transformer_1.plainToClass(this.entityType, { ...dto, ...parsed.authPersist });
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
    getEntityColumns(entityMetadata) {
        const columns = entityMetadata.columns.map((prop) => prop.propertyPath) ||
            [];
        const primaryColumns = entityMetadata.primaryColumns.map((prop) => prop.propertyPath) ||
            [];
        return { columns, primaryColumns };
    }
    getRelationMetadata(field, options) {
        try {
            let allowedRelation;
            let nested = false;
            if (this.entityRelationsHash.has(field)) {
                allowedRelation = this.entityRelationsHash.get(field);
            }
            else {
                const fields = field.split('.');
                let relationMetadata;
                let name;
                let path;
                let parentPath;
                if (fields.length === 1) {
                    const found = this.repo.metadata.relations.find((one) => one.propertyName === fields[0]);
                    if (found) {
                        name = fields[0];
                        path = `${this.alias}.${fields[0]}`;
                        relationMetadata = found.inverseEntityMetadata;
                    }
                }
                else {
                    nested = true;
                    parentPath = '';
                    const reduced = fields.reduce((res, propertyName, i) => {
                        const found = res.relations.length
                            ? res.relations.find((one) => one.propertyName === propertyName)
                            : null;
                        const relationMetadata = found ? found.inverseEntityMetadata : null;
                        const relations = relationMetadata ? relationMetadata.relations : [];
                        name = propertyName;
                        if (i !== fields.length - 1) {
                            parentPath = !parentPath
                                ? propertyName
                                : `${parentPath}.${propertyName}`;
                        }
                        return {
                            relations,
                            relationMetadata,
                        };
                    }, {
                        relations: this.repo.metadata.relations,
                        relationMetadata: null,
                    });
                    relationMetadata = reduced.relationMetadata;
                }
                if (relationMetadata) {
                    const { columns, primaryColumns } = this.getEntityColumns(relationMetadata);
                    if (!path && parentPath) {
                        const parentAllowedRelation = this.entityRelationsHash.get(parentPath);
                        if (parentAllowedRelation) {
                            path = parentAllowedRelation.alias
                                ? `${parentAllowedRelation.alias}.${name}`
                                : field;
                        }
                    }
                    allowedRelation = {
                        alias: options.alias,
                        name,
                        path,
                        columns,
                        nested,
                        primaryColumns,
                    };
                }
            }
            if (allowedRelation) {
                const allowedColumns = this.getAllowedColumns(allowedRelation.columns, options);
                const toSave = { ...allowedRelation, allowedColumns };
                this.entityRelationsHash.set(field, toSave);
                if (options.alias) {
                    this.entityRelationsHash.set(options.alias, toSave);
                }
                return toSave;
            }
        }
        catch (_) {
            return null;
        }
    }
    setJoin(cond, joinOptions, builder) {
        const options = joinOptions[cond.field];
        if (!options) {
            return true;
        }
        const allowedRelation = this.getRelationMetadata(cond.field, options);
        if (!allowedRelation) {
            return true;
        }
        const relationType = options.required ? 'innerJoin' : 'leftJoin';
        const alias = options.alias ? options.alias : allowedRelation.name;
        builder[relationType](allowedRelation.path, alias);
        if (options.select !== false) {
            const columns = util_1.isArrayFull(cond.select)
                ? cond.select.filter((column) => allowedRelation.allowedColumns.some((allowed) => allowed === column))
                : allowedRelation.allowedColumns;
            const select = [
                ...allowedRelation.primaryColumns,
                ...(util_1.isArrayFull(options.persist) ? options.persist : []),
                ...columns,
            ].map((col) => `${alias}.${col}`);
            builder.addSelect(select);
        }
    }
    setAndWhere(cond, i, builder) {
        const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i}`);
        builder.andWhere(str, params);
    }
    setOrWhere(cond, i, builder) {
        const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i}`);
        builder.orWhere(str, params);
    }
    setSearchCondition(builder, search, condition = '$and') {
        if (util_1.isObject(search)) {
            const keys = util_1.objKeys(search);
            if (keys.length) {
                if (util_1.isArrayFull(search.$and)) {
                    if (search.$and.length === 1) {
                        this.setSearchCondition(builder, search.$and[0], condition);
                    }
                    else {
                        this.builderAddBrackets(builder, condition, new typeorm_1.Brackets((qb) => {
                            search.$and.forEach((item) => {
                                this.setSearchCondition(qb, item, '$and');
                            });
                        }));
                    }
                }
                else if (util_1.isArrayFull(search.$or)) {
                    if (keys.length === 1) {
                        if (search.$or.length === 1) {
                            this.setSearchCondition(builder, search.$or[0], condition);
                        }
                        else {
                            this.builderAddBrackets(builder, condition, new typeorm_1.Brackets((qb) => {
                                search.$or.forEach((item) => {
                                    this.setSearchCondition(qb, item, '$or');
                                });
                            }));
                        }
                    }
                    else {
                        this.builderAddBrackets(builder, condition, new typeorm_1.Brackets((qb) => {
                            keys.forEach((field) => {
                                if (field !== '$or') {
                                    const value = search[field];
                                    if (!util_1.isObject(value)) {
                                        this.builderSetWhere(qb, '$and', field, value);
                                    }
                                    else {
                                        this.setSearchFieldObjectCondition(qb, '$and', field, value);
                                    }
                                }
                                else {
                                    if (search.$or.length === 1) {
                                        this.setSearchCondition(builder, search.$or[0], '$and');
                                    }
                                    else {
                                        this.builderAddBrackets(qb, '$and', new typeorm_1.Brackets((qb2) => {
                                            search.$or.forEach((item) => {
                                                this.setSearchCondition(qb2, item, '$or');
                                            });
                                        }));
                                    }
                                }
                            });
                        }));
                    }
                }
                else {
                    if (keys.length === 1) {
                        const field = keys[0];
                        const value = search[field];
                        if (!util_1.isObject(value)) {
                            this.builderSetWhere(builder, condition, field, value);
                        }
                        else {
                            this.setSearchFieldObjectCondition(builder, condition, field, value);
                        }
                    }
                    else {
                        this.builderAddBrackets(builder, condition, new typeorm_1.Brackets((qb) => {
                            keys.forEach((field) => {
                                const value = search[field];
                                if (!util_1.isObject(value)) {
                                    this.builderSetWhere(qb, '$and', field, value);
                                }
                                else {
                                    this.setSearchFieldObjectCondition(qb, '$and', field, value);
                                }
                            });
                        }));
                    }
                }
            }
        }
    }
    builderAddBrackets(builder, condition, brackets) {
        if (condition === '$and') {
            builder.andWhere(brackets);
        }
        else {
            builder.orWhere(brackets);
        }
    }
    builderSetWhere(builder, condition, field, value, operator = '$eq') {
        const time = process.hrtime();
        const index = `${field}${time[0]}${time[1]}`;
        const args = [
            { field, operator: util_1.isNull(value) ? '$isnull' : operator, value },
            index,
            builder,
        ];
        const fn = condition === '$and' ? this.setAndWhere : this.setOrWhere;
        fn.apply(this, args);
    }
    setSearchFieldObjectCondition(builder, condition, field, object) {
        if (util_1.isObject(object)) {
            const operators = util_1.objKeys(object);
            if (operators.length === 1) {
                const operator = operators[0];
                const value = object[operator];
                if (util_1.isObject(object.$or)) {
                    const orKeys = util_1.objKeys(object.$or);
                    this.setSearchFieldObjectCondition(builder, orKeys.length === 1 ? condition : '$or', field, object.$or);
                }
                else {
                    this.builderSetWhere(builder, condition, field, value, operator);
                }
            }
            else {
                if (operators.length > 1) {
                    this.builderAddBrackets(builder, condition, new typeorm_1.Brackets((qb) => {
                        operators.forEach((operator) => {
                            const value = object[operator];
                            if (operator !== '$or') {
                                this.builderSetWhere(qb, condition, field, value, operator);
                            }
                            else {
                                const orKeys = util_1.objKeys(object.$or);
                                if (orKeys.length === 1) {
                                    this.setSearchFieldObjectCondition(qb, condition, field, object.$or);
                                }
                                else {
                                    this.builderAddBrackets(qb, condition, new typeorm_1.Brackets((qb2) => {
                                        this.setSearchFieldObjectCondition(qb2, '$or', field, object.$or);
                                    }));
                                }
                            }
                        });
                    }));
                }
            }
        }
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
    getSort(query, options) {
        return query.sort && query.sort.length
            ? this.mapSort(query.sort)
            : options.sort && options.sort.length
                ? this.mapSort(options.sort)
                : {};
    }
    getFieldWithAlias(field, sort = false) {
        const i = ['mysql', 'mariadb'].includes(this.dbName) ? '`' : '"';
        const cols = field.split('.');
        switch (cols.length) {
            case 1:
                if (sort) {
                    return `${this.alias}.${field}`;
                }
                const dbColName = this.entityColumnsHash[field] !== field ? this.entityColumnsHash[field] : field;
                return `${i}${this.alias}${i}.${i}${dbColName}${i}`;
            case 2:
                return field;
            default:
                return cols.slice(cols.length - 2, cols.length).join('.');
        }
    }
    mapSort(sort) {
        const params = {};
        for (let i = 0; i < sort.length; i++) {
            const field = this.getFieldWithAlias(sort[i].field, true);
            const checkedFiled = this.checkSqlInjection(field);
            params[checkedFiled] = sort[i].order;
        }
        return params;
    }
    mapOperatorsToQuery(cond, param) {
        const field = this.getFieldWithAlias(cond.field);
        const likeOperator = this.dbName === 'postgres' ? 'ILIKE' : 'LIKE';
        let str;
        let params;
        if (cond.operator[0] !== '$') {
            cond.operator = ('$' + cond.operator);
        }
        switch (cond.operator) {
            case '$eq':
                str = `${field} = :${param}`;
                break;
            case '$ne':
                str = `${field} != :${param}`;
                break;
            case '$gt':
                str = `${field} > :${param}`;
                break;
            case '$lt':
                str = `${field} < :${param}`;
                break;
            case '$gte':
                str = `${field} >= :${param}`;
                break;
            case '$lte':
                str = `${field} <= :${param}`;
                break;
            case '$starts':
                str = `${field} LIKE :${param}`;
                params = { [param]: `${cond.value}%` };
                break;
            case '$ends':
                str = `${field} LIKE :${param}`;
                params = { [param]: `%${cond.value}` };
                break;
            case '$cont':
                str = `${field} LIKE :${param}`;
                params = { [param]: `%${cond.value}%` };
                break;
            case '$excl':
                str = `${field} NOT LIKE :${param}`;
                params = { [param]: `%${cond.value}%` };
                break;
            case '$in':
                this.checkFilterIsArray(cond);
                str = `${field} IN (:...${param})`;
                break;
            case '$notin':
                this.checkFilterIsArray(cond);
                str = `${field} NOT IN (:...${param})`;
                break;
            case '$isnull':
                str = `${field} IS NULL`;
                params = {};
                break;
            case '$notnull':
                str = `${field} IS NOT NULL`;
                params = {};
                break;
            case '$between':
                this.checkFilterIsArray(cond, cond.value.length !== 2);
                str = `${field} BETWEEN :${param}0 AND :${param}1`;
                params = {
                    [`${param}0`]: cond.value[0],
                    [`${param}1`]: cond.value[1],
                };
                break;
            case '$eqL':
                str = `LOWER(${field}) = :${param}`;
                break;
            case '$neL':
                str = `LOWER(${field}) != :${param}`;
                break;
            case '$startsL':
                str = `LOWER(${field}) ${likeOperator} :${param}`;
                params = { [param]: `${cond.value}%` };
                break;
            case '$endsL':
                str = `LOWER(${field}) ${likeOperator} :${param}`;
                params = { [param]: `%${cond.value}` };
                break;
            case '$contL':
                str = `LOWER(${field}) ${likeOperator} :${param}`;
                params = { [param]: `%${cond.value}%` };
                break;
            case '$exclL':
                str = `LOWER(${field}) NOT ${likeOperator} :${param}`;
                params = { [param]: `%${cond.value}%` };
                break;
            case '$inL':
                this.checkFilterIsArray(cond);
                str = `LOWER(${field}) IN (:...${param})`;
                break;
            case '$notinL':
                this.checkFilterIsArray(cond);
                str = `LOWER(${field}) NOT IN (:...${param})`;
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
    checkFilterIsArray(cond, withLength) {
        if (!Array.isArray(cond.value) ||
            !cond.value.length ||
            (!util_1.isNil(withLength) ? withLength : false)) {
            this.throwBadRequestException(`Invalid column '${cond.field}' value`);
        }
    }
    checkSqlInjection(field) {
        if (this.sqlInjectionRegEx.length) {
            for (let i = 0; i < this.sqlInjectionRegEx.length; i++) {
                if (this.sqlInjectionRegEx[0].test(field)) {
                    this.throwBadRequestException(`SQL injection detected: "${field}"`);
                }
            }
        }
        return field;
    }
}
exports.TypeOrmCrudService = TypeOrmCrudService;
//# sourceMappingURL=typeorm-crud.service.js.map
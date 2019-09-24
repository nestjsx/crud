import {
  CreateManyDto,
  CrudRequest,
  CrudRequestOptions,
  CrudService,
  GetManyDefaultResponse,
  QueryOptions
} from "@nestjsx/crud";
import { ParsedRequestParams, QueryFilter } from "@nestjsx/crud-request";
import {
  hasLength,
  isArrayFull,
  isObject,
  isUndefined,
  objKeys
} from "@nestjsx/util";
import * as _ from "lodash";
import { Op } from "sequelize";
import { Model } from "sequelize-typescript";

export class SequelizeCrudService<T extends Model<T>> extends CrudService<T> {
  private entityColumns: string[];
  private entityPrimaryColumns: string[];
  private entityColumnsHash = {};
  private entityRelationsHash = {};

  constructor(protected model: T & typeof Model) {
    super();
    this.onInitMapEntityColumns();
    this.onInitMapRelations();
  }

  public get findOne() {
    return this.model.findOne.bind(this.model);
  }

  public get find() {
    return this.model.findAll.bind(this.model);
  }

  public get count() {
    return this.model.count.bind(this.model);
  }
  /**
   * Create many
   * @param req
   * @param dto
   */
  public async createMany(
    req: CrudRequest,
    dto: CreateManyDto<T>
  ): Promise<T[]> {
    /* istanbul ignore if */
    if (!isObject(dto) || !isArrayFull(dto.bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const bulk = dto.bulk
      .map(one => this.prepareEntityBeforeSave(one, req.parsed.paramsFilter))
      .filter(d => !isUndefined(d));

    /* istanbul ignore if */
    if (!hasLength(bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const created = await this.model.bulkCreate(bulk, { returning: true });
    return created as T[];
  }

  async createOne(req: CrudRequest, dto: T): Promise<T> {
    const entity = this.prepareEntityBeforeSave(dto, req.parsed.paramsFilter);
    const obj = await this.model.create(entity);
    return obj as T;
  }

  /**
   * Delete one
   * @param req
   */
  public async deleteOne(req: CrudRequest): Promise<void | T> {
    const found = await this.getOneOrFail(req);
    await this.model.destroy({
      where: {
        id: found.id
      }
    });

    /* istanbul ignore else */
    if (req.options.routes.deleteOneBase.returnDeleted) {
      return found;
    }
  }

  public decidePagination(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions
  ): boolean {
    return (
      (Number.isFinite(parsed.page) || Number.isFinite(parsed.offset)) &&
      !!this.getTake(parsed, options.query)
    );
  }

  async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const { parsed, options } = req;
    const query = this.createBuilder(parsed, options);

    if (this.decidePagination(parsed, options)) {
      const { rows: data, count: total } = await this.model.findAndCountAll(
        query
      );
      // const limit = builder.expressionMap.take;
      // const offset = builder.expressionMap.skip;

      return this.createPageInfo(
        data as T[],
        total,
        this.getTake(query, options),
        query.offset
      );
    }
    const res = await this.model.findAll(query);
    return res as T[];
  }

  /**
   * Get one
   * @param req
   */
  public async getOne(req: CrudRequest): Promise<T> {
    return this.getOneOrFail(req);
  }

  async replaceOne(req: CrudRequest, dto: T): Promise<T> {
    /* istanbul ignore else */
    if (
      hasLength(req.parsed.paramsFilter) &&
      !req.options.routes.updateOneBase.allowParamsOverride
    ) {
      for (const filter of req.parsed.paramsFilter) {
        dto[filter.field] = filter.value;
      }
    }
    const found = await this.model.findByPk(dto.id);
    if (found) {
      found.set(dto);
      return (await found.save()) as T;
    } else {
      // don't set id if this record is not found, let the db set it
      delete dto.id;
      const obj = this.model.build(dto);
      return (await obj.save()) as T;
    }
  }

  /**
   * Update one
   * @param req
   * @param dto
   */
  public async updateOne(req: CrudRequest, dto: T): Promise<T> {
    const found = await this.getOneOrFail(req);
    /* istanbul ignore else */
    if (
      hasLength(req.parsed.paramsFilter) &&
      !req.options.routes.updateOneBase.allowParamsOverride
    ) {
      for (const filter of req.parsed.paramsFilter) {
        dto[filter.field] = filter.value;
      }
    }
    found.set(dto);
    return found.save();
  }

  private async getOneOrFail(req: CrudRequest): Promise<T> {
    const { parsed, options } = req;
    const query = this.createBuilder(parsed, options);
    const found = await this.model.findOne(query);

    if (!found) {
      this.throwNotFoundException(this.model.name);
    }
    return found as T;
  }

  private hasColumn(column: string): boolean {
    return this.entityColumnsHash[column];
  }

  private hasRelation(column: string): boolean {
    return this.entityRelationsHash[column];
  }

  private onInitMapEntityColumns() {
    const columns = Object.keys(this.model.rawAttributes).map(
      key => this.model.rawAttributes[key]
    );
    this.entityColumns = Object.keys(this.model.rawAttributes).map(column => {
      this.entityColumnsHash[column] = true;
      return column;
    });
    this.entityPrimaryColumns = columns
      .filter(column => column.primaryKey)
      .map(column => column.field);
  }

  private prepareEntityBeforeSave(dto: T, paramsFilter: QueryFilter[]): T {
    /* istanbul ignore if */
    if (!isObject(dto)) {
      return undefined;
    }

    if (hasLength(paramsFilter)) {
      for (const filter of paramsFilter) {
        dto[filter.field] = filter.value;
      }
    }

    /* istanbul ignore if */
    if (!hasLength(objKeys(dto))) {
      return undefined;
    }

    return dto;
  }

  /**
   * Create TypeOrm QueryBuilder
   * @param parsed
   * @param options
   * @param many
   */
  public createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many = true
  ) {
    // create query builder
    const query = {
      subQuery: false,
      where: {},
      attributes: [],
      exclude: [],
      include: [],
      order: [],
      limit: null,
      offset: null
    };
    // get select fields
    query.attributes = this.getSelect(parsed, options.query);

    // select fields

    // set mandatory where condition from CrudOptions.query.filter
    if (isArrayFull(options.query.filter)) {
      for (let i = 0; i < options.query.filter.length; i++) {
        const { field, obj } = this.setAndWhere(options.query.filter[i]);
        query.where[field] = obj;
      }
    }

    // set join
    parsed.join.every(j =>
      this.validateJoin(j.field.split("."), "", this.model)
    );

    query.include = this.createJoinObject(
      this.mainJoins(
        parsed.join
          .map(j => j.field)
          .filter(j => this.entityRelationsHash[j] !== null)
      ),
      "",
      parsed.join
    );

    const filters = [...parsed.paramsFilter, ...parsed.filter];
    const hasFilter = isArrayFull(filters);
    const hasOr = isArrayFull(parsed.or);
    const whereFilter = {
      and: [],
      or: []
    };
    if (hasFilter && hasOr) {
      whereFilter.and = filters.map(filter => {
        const { field, obj } = this.setAndWhere(filter);
        return { [field]: obj };
      });
      whereFilter.or = parsed.or.map(filter => {
        const { field, obj } = this.setAndWhere(filter);
        return { [field]: obj };
      });
      query.where[Op.or] = [
        whereFilter.and.reduce((acc, item) => {
          Object.keys(item).forEach(k => {
            if (acc[k]) {
              acc[k] = { ...acc[k], ...item[k] };
            } else {
              acc[k] = item[k];
            }
          });
          return acc;
        }, {}),
        whereFilter.or.reduce((acc, item) => {
          Object.keys(item).forEach(k => {
            if (acc[k]) {
              acc[k] = { ...acc[k], ...item[k] };
            } else {
              acc[k] = item[k];
            }
          });
          return acc;
        }, {})
      ];
    } else if (hasFilter) {
      // tslint:disable-next-line:prefer-for-of
      whereFilter.and = filters.map(filter => {
        const { field, obj } = this.setAndWhere(filter);
        return { [field]: obj };
      });
      query.where[Op.and] = whereFilter.and;
    } else if (hasOr) {
      whereFilter.or = parsed.or.map(filter => {
        const { field, obj } = this.setAndWhere(filter);
        return { [field]: obj };
      });
      query.where[Op.or] = whereFilter.or;
    }

    /* istanbul ignore else */
    if (many) {
      // set sort (order by)
      query.order = this.mapSort(parsed.sort, parsed.join.map(j => j.field));
      // set take
      const take = this.getTake(parsed, options.query);
      /* istanbul ignore else */
      if (isFinite(take)) {
        query.limit = take;
      }

      // set skip
      const skip = this.getSkip(parsed, take);
      /* istanbul ignore else */
      if (isFinite(skip)) {
        query.offset = skip;
      }
    }
    return query;
  }

  private validateJoin(join, path, currentTarget) {
    if (!join || !join.length || !currentTarget) {
      return true;
    }
    const parent = join[0];
    const newPath = path.length ? path + "." + parent : parent;
    const tmpTarget = currentTarget.associations[parent];
    if (!this.entityRelationsHash[newPath]) {
      this.entityRelationsHash[newPath] = tmpTarget
        ? {
            name: parent,
            type: tmpTarget.associationType,
            columns: Object.keys(tmpTarget.target.rawAttributes),
            referencedColumn: tmpTarget.foreignKey,
            modelName: tmpTarget.target.name
          }
        : null;
    }
    join.shift();
    return this.validateJoin(join, newPath, (tmpTarget || {}).target);
  }

  private mainJoins(basicJoins) {
    if (!basicJoins.length) {
      return basicJoins;
    }
    const groupedJoins = _.groupBy(
      basicJoins.map(join => join.split(".")),
      join => join[0]
    );
    Object.keys(groupedJoins).map(key => {
      const value = groupedJoins[key]
        .map(arr => _.remove(arr, join => join !== key))
        .filter(arr => arr.length);
      if (!value.length) {
        groupedJoins[key] = [];
        return [];
      }
      const preparedValue = _.concat(
        _.flatten(value.map(arr => arr.join(".")))
      );
      /* istanbul ignore next */
      groupedJoins[key] = this.mainJoins(preparedValue) || [];
    });
    return groupedJoins;
  }

  private createJoinObject(joinObject, path, selects) {
    return Object.keys(joinObject).map(key => {
      const newPath = `${path.length ? path + "." : path}${key}`;
      /* istanbul ignore next */
      const tempSelect = _.find(selects, s => s.field === newPath) || [];
      const temp = {
        association: key,
        include: [],
        /* istanbul ignore next */
        select: !_.isEmpty(tempSelect)
          ? tempSelect.select
          : /* istanbul ignore next */ []
      };
      /* istanbul ignore else */
      if (!Array.isArray(joinObject[key])) {
        temp.include = this.createJoinObject(joinObject[key], newPath, selects);
      }
      return temp;
    });
  }

  mapSort(sorts, joinsArray) {
    const params = [];
    sorts.forEach(sort => {
      this.validateHasColumn(sort.field);
      if (sort.field.indexOf(".") === -1) {
        params.push([sort.field, sort.order]);
      } else {
        const column = sort.field.split(".").pop();
        const relation = sort.field.substr(0, sort.field.lastIndexOf("."));
        const entity = this.entityRelationsHash[relation];
        /* istanbul ignore else */
        if (entity && joinsArray.indexOf(relation) !== -1) {
          params.push([
            ...relation.split(".").map(k => ({
              model: this.model.sequelize.models[
                this.entityRelationsHash[k].modelName
              ],
              as: this.entityRelationsHash[k].name
            })),
            column,
            sort.order
          ]);
        }
      }
    });
    return params;
  }

  private getSelect(
    query: ParsedRequestParams,
    options: QueryOptions
  ): string[] {
    const allowed = this.getAllowedColumns(this.entityColumns, options);
    const columns =
      query.fields && query.fields.length
        ? query.fields.filter(field => allowed.some(col => field === col))
        : allowed;

    return [
      ...(options.persist && options.persist.length ? options.persist : []),
      ...columns,
      ...this.entityPrimaryColumns
    ];
  }

  private getAllowedColumns(
    columns: string[],
    options: QueryOptions
  ): string[] {
    return (!options.exclude || !options.exclude.length) &&
      (!options.allow || /* istanbul ignore next */ !options.allow.length)
      ? columns
      : columns.filter(
          column =>
            (options.exclude && options.exclude.length
              ? !options.exclude.some(col => col === column)
              : /* istanbul ignore next */ true) &&
            (options.allow && options.allow.length
              ? options.allow.some(col => col === column)
              : /* istanbul ignore next */ true)
        );
  }

  private setAndWhere(cond: QueryFilter) {
    this.validateHasColumn(cond.field);
    if (cond.field.indexOf(".") !== -1) {
      cond.field = `$${cond.field}$`;
    }
    const { field, obj } = this.mapOperatorsToQuery(cond);
    return { field, obj };
  }

  private validateHasColumn(column: string) {
    if (column.indexOf(".") !== -1) {
      const nests = column.split(".");
      let relation;
      column = nests[nests.length - 1];
      relation = nests.slice(0, nests.length - 1).join(".");
      if (!this.hasRelation(relation)) {
        this.throwBadRequestException(`Invalid relation name '${relation}'`);
      }
      const noColumn = !this.entityRelationsHash[relation].columns.find(
        o => o === column
      );
      if (noColumn) {
        this.throwBadRequestException(
          `Invalid column name '${column}' for relation '${relation}'`
        );
      }
    } else {
      if (!this.hasColumn(column)) {
        this.throwBadRequestException(`Invalid column name '${column}'`);
      }
    }
  }

  private onInitMapRelations() {
    const result = {};
    Object.keys(this.model.associations).forEach(key => {
      result[key] = {
        type: this.model.associations[key].associationType,
        columns: Object.keys(this.model.associations[key].target.rawAttributes),
        referencedColumn: this.model.associations[key].foreignKey,
        name: key,
        modelName: this.model.associations[key].target.name
      };
    });
    this.entityRelationsHash = result;
  }

  private mapOperatorsToQuery(cond: QueryFilter) {
    let obj: {};
    switch (cond.operator) {
      case "eq":
        obj = {
          [Op.eq]: cond.value
        };
        break;

      case "ne":
        obj = {
          [Op.ne]: cond.value
        };
        break;

      case "gt":
        obj = {
          [Op.gt]: cond.value
        };
        break;

      case "lt":
        obj = {
          [Op.lt]: cond.value
        };
        break;

      case "gte":
        obj = {
          [Op.gte]: cond.value
        };
        break;

      case "lte":
        obj = {
          [Op.lte]: cond.value
        };
        break;

      case "starts":
        obj = {
          [Op.like]: `${cond.value}%`
        };
        break;

      case "ends":
        obj = {
          [Op.like]: `%${cond.value}`
        };
        break;

      case "cont":
        obj = {
          [Op.like]: `%${cond.value}%`
        };
        break;

      case "excl":
        obj = {
          [Op.notLike]: `%${cond.value}%`
        };
        break;

      case "in":
        /* istanbul ignore if */
        if (!Array.isArray(cond.value) || !cond.value.length) {
          this.throwBadRequestException(`Invalid column '${cond.field}' value`);
        }
        obj = {
          [Op.in]: cond.value
        };
        break;

      case "notin":
        /* istanbul ignore if */
        if (!Array.isArray(cond.value) || !cond.value.length) {
          this.throwBadRequestException(`Invalid column '${cond.field}' value`);
        }
        obj = {
          [Op.notIn]: cond.value
        };
        break;

      case "isnull":
        obj = {
          [Op.is]: null
        };
        break;

      case "notnull":
        obj = {
          [Op.not]: null
        };
        break;

      case "between":
        /* istanbul ignore if */
        if (
          !Array.isArray(cond.value) ||
          !cond.value.length ||
          cond.value.length !== 2
        ) {
          this.throwBadRequestException(`Invalid column '${cond.field}' value`);
        }
        obj = {
          [Op.between]: cond.value
        };
        break;

      /* istanbul ignore next */
      default:
        obj = {
          [Op.eq]: cond.value
        };
        break;
    }
    return { field: cond.field, obj };
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
        ? /* istanbul ignore next */
          options.limit <= options.maxLimit
          ? options.limit
          : options.maxLimit
        : options.limit;
    }
    return options.maxLimit ? options.maxLimit : null;
  }
}

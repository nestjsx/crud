import {
  CreateManyDto,
  CrudRequest,
  CrudRequestOptions,
  CrudService,
  GetManyDefaultResponse,
  JoinOptions,
  QueryOptions,
} from '@nestjsx/crud';
import {
  ParsedRequestParams,
  QueryFilter,
  ComparisonOperator,
  QueryJoin,
} from '@nestjsx/crud-request';
import {
  hasLength,
  isArrayFull,
  isObject,
  isUndefined,
  objKeys,
  isNil,
} from '@nestjsx/util';
import { oO } from '@zmotivat0r/o0';
import { Model } from 'sequelize-typescript';
import * as Sequelize from 'sequelize';
import * as _ from 'lodash';
import { isArray } from 'util';
import { classToPlain } from 'class-transformer';

interface Relation {
  type: string;
  columns: string[];
  referencedColumn: string;
  name: string;
  modelName: string;
}

export class SequelizeCrudService<T extends Model> extends CrudService<T> {
  protected entityColumns: string[];
  protected entityPrimaryColumns: string[];
  protected entityColumnsHash: Record<string, any> = {};
  protected entityRelationsHash: Record<string, Relation> = {};

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
   * Get many
   * @param req
   */
  public async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const { parsed, options } = req;
    const query = this.createBuilder(parsed, options);

    if (this.decidePagination(parsed, options)) {
      const { rows: data, count: total } = await this.model.findAndCountAll(query);
      return this.createPageInfo(
        data as T[],
        total,
        this.getTake(parsed, options.query),
        query.offset,
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

  /**
   * Create one
   * @param req
   * @param dto
   */
  public async createOne(req: CrudRequest, dto: T): Promise<T> {
    const { returnShallow } = req.options.routes.createOneBase;
    const entity = this.prepareEntityBeforeSave(dto, req.parsed);

    /* istanbul ignore if */
    if (!entity) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const saved = await this.model.create(entity);

    if (returnShallow) {
      return saved as T;
    } else {
      const primaryParam = this.getPrimaryParam(req.options);

      /* istanbul ignore if */
      if (!primaryParam && /* istanbul ignore next */ isNil(saved[primaryParam])) {
        return saved as T;
      } else {
        req.parsed.search = { [primaryParam]: saved[primaryParam] };
        return this.getOneOrFail(req);
      }
    }
  }

  /**
   * Create many
   * @param req
   * @param dto
   */
  public async createMany(req: CrudRequest, dto: CreateManyDto<T>): Promise<T[]> {
    /* istanbul ignore if */
    if (!isObject(dto) || !isArrayFull(dto.bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const bulk = dto.bulk
      .map((one) => this.prepareEntityBeforeSave(one, req.parsed))
      .filter((d) => !isUndefined(d));

    /* istanbul ignore if */
    if (!hasLength(bulk)) {
      this.throwBadRequestException(`Empty data. Nothing to save.`);
    }

    const created = await this.model.bulkCreate(bulk, { returning: true });
    return created as T[];
  }

  /**
   * Update one
   * @param req
   * @param dto
   */
  public async updateOne(req: CrudRequest, dto: T): Promise<T> {
    const { allowParamsOverride, returnShallow } = req.options.routes.updateOneBase;
    let tdto = this.transformDto(dto) as T;
    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    let toSave = !allowParamsOverride
      ? { ...tdto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...tdto, ...req.parsed.authPersist };

    // remove undefined fields
    found.set(toSave);
    const updated = await found.save();

    if (returnShallow) {
      return updated;
    } else {
      req.parsed.paramsFilter.forEach((filter) => {
        filter.value = updated[filter.field];
      });

      return this.getOneOrFail(req);
    }
  }

  /**
   * Replace one
   * @param req
   * @param dto
   */
  public async replaceOne(req: CrudRequest, dto: T): Promise<T> {
    const { allowParamsOverride, returnShallow } = req.options.routes.replaceOneBase;
    let tdto = this.transformDto(dto) as T;
    const paramsFilters = this.getParamFilters(req.parsed);
    const [, found] = await oO(this.getOneOrFail(req, returnShallow));
    let toSave = !allowParamsOverride
      ? { ...tdto, ...paramsFilters, ...req.parsed.authPersist }
      : { ...paramsFilters, ...tdto, ...req.parsed.authPersist };

    let replaced: Model<T>;
    if (found) {
      found.set(toSave);
      replaced = await found.save();
    } else {
      // don't set id if this record is not found, let the db set it
      delete toSave.id;
      const obj = this.model.build(toSave);
      replaced = await obj.save();
    }

    if (returnShallow) {
      return replaced as T;
    } else {
      const primaryParam = this.getPrimaryParam(req.options);

      /* istanbul ignore if */
      if (!primaryParam) {
        return replaced as T;
      }

      req.parsed.search = { [primaryParam]: replaced[primaryParam] };
      return this.getOneOrFail(req);
    }
  }

  /**
   * Delete one
   * @param req
   */
  public async deleteOne(req: CrudRequest): Promise<void | T> {
    const { returnDeleted } = req.options.routes.deleteOneBase;
    const found = await this.getOneOrFail(req, returnDeleted);
    const toReturn = returnDeleted ? found : undefined;
    await found.destroy();

    return toReturn;
  }

  public getParamFilters(parsed: CrudRequest['parsed']): Record<string, any> {
    let filters = {};

    /* istanbul ignore else */
    if (hasLength(parsed.paramsFilter)) {
      for (const filter of parsed.paramsFilter) {
        filters[filter.field] = filter.value;
      }
    }

    return filters;
  }

  public decidePagination(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
  ): boolean {
    return (
      options.query.alwaysPaginate ||
      ((Number.isFinite(parsed.page) || Number.isFinite(parsed.offset)) &&
        !!this.getTake(parsed, options.query))
    );
  }

  /**
   * Create Sequelize Query builder
   * @param parsed
   * @param options
   * @param many
   */
  public createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many = true,
  ): Sequelize.FindOptions {
    // create query builder
    const query: Sequelize.FindOptions = {
      subQuery: false,
      where: {},
      attributes: [],
      include: [],
      order: [],
      limit: null,
      offset: null,
    };
    // get select fields
    query.attributes = this.getSelect(parsed, options.query);

    // set joins
    const joinOptions: JoinOptions = options.query.join || {};
    const allowedJoins = objKeys(joinOptions);

    let joinsArray: Sequelize.IncludeOptions[] = [];
    if (hasLength(allowedJoins)) {
      const eagerJoins: any = {};

      for (let i = 0; i < allowedJoins.length; i++) {
        /* istanbul ignore else */
        if (joinOptions[allowedJoins[i]].eager) {
          const cond = parsed.join.find((j) => j && j.field === allowedJoins[i]) || {
            field: allowedJoins[i],
          };
          const include = this.createInclude(cond, joinOptions);
          /* istanbul ignore else */
          if (include) {
            joinsArray.push(include);
          }
          eagerJoins[allowedJoins[i]] = true;
        }
      }

      if (isArrayFull(parsed.join)) {
        for (let i = 0; i < parsed.join.length; i++) {
          /* istanbul ignore else */
          if (!eagerJoins[parsed.join[i].field]) {
            const include = this.createInclude(parsed.join[i], joinOptions);
            if (include) {
              joinsArray.push(include);
            }
          }
        }
      }
    }

    if (isArrayFull(joinsArray)) {
      // convert nested joins
      query.include = this.convertNestedInclusions(joinsArray);
    }

    // search
    // populate the alias map
    const aliases = {};
    if (options && options.query && options.query.join) {
      _.forEach(options.query.join, (join, association) => {
        if (join.alias) {
          aliases[join.alias] = association;
        }
      });
    }
    query.where = this.buildWhere(parsed.search, aliases);

    /* istanbul ignore else */
    if (many) {
      // set sort (order by)
      query.order = this.mapSort(parsed.sort, joinsArray.map((join) => join.association));
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

  /**
   * Convert a flat include array into array with nested includes
   * @param include
   */
  protected convertNestedInclusions(
    include: Sequelize.IncludeOptions[],
  ): Sequelize.IncludeOptions[] {
    let nestedInclusions = include.filter(
      (item: Sequelize.IncludeOptions) => (item.association as string).indexOf('.') > -1,
    );
    nestedInclusions = _.sortBy(
      nestedInclusions,
      (item) => (item.association as string).split('.').length,
    );
    const convertedInclusions: Sequelize.IncludeOptions[] = include.filter(
      (item: Sequelize.IncludeOptions) =>
        (item.association as string).indexOf('.') === -1,
    );
    nestedInclusions.forEach((include) => {
      const names = (include.association as string).split('.');
      // traverse the include chain to find the right inclusion
      let parentInclude: Sequelize.IncludeOptions = {
        include: convertedInclusions,
        association: 'root',
      };
      let childInclude: Sequelize.IncludeOptions;
      // ensure the include objects exist
      for (let i = 0; i < names.length - 1; ++i) {
        childInclude = parentInclude.include.find(
          (item: Sequelize.IncludeOptions) => item.association === names[i],
        ) as Sequelize.IncludeOptions;
        /* istanbul ignore if */
        if (!childInclude) {
          // the parent entity of the nested include was not joined, ignore the nested include
          parentInclude = null;
          break;
        }
        /* istanbul ignore else */
        if (!childInclude.include) {
          childInclude.include = [];
        }
        parentInclude = childInclude;
      }
      /* istanbul ignore else */
      if (parentInclude) {
        parentInclude.include.push({
          ...include,
          association: _.last(names),
        });
      }
    });
    return convertedInclusions;
  }

  protected buildWhere(
    search: any,
    aliases: Record<string, string>,
    field = '',
  ): Record<string, any> {
    let where: any;
    if (isArray(search)) {
      where = search.map((item) => this.buildWhere(item, aliases));
    } else if (isObject(search)) {
      const keys = Object.keys(search);
      const objects = keys.map((key) => {
        if (this.isOperator(key)) {
          const { obj } = this.mapOperatorsToQuery({
            field,
            operator: key as ComparisonOperator,
            value: this.buildWhere(search[key], aliases, field),
          });
          return obj;
        } else if (key === '$and') {
          return { [Sequelize.Op.and]: this.buildWhere(search[key], aliases) };
        } else if (key === '$or') {
          return { [Sequelize.Op.or]: this.buildWhere(search[key], aliases) };
        } else {
          if (key.indexOf('.') > -1) {
            // a key from a joined table
            const normalized = key
              .split('.')
              .map((name) => aliases[name] || name)
              .join('.');
            return {
              [`$${normalized}$`]: this.buildWhere(search[key], aliases, normalized),
            };
          }
          return { [key]: this.buildWhere(search[key], aliases, key) };
        }
      });
      where = Object.assign({}, ...objects);
    } else {
      // search is a value, just return it
      where = search;
    }
    return where;
  }

  mapSort(sorts: { field: string; order: string }[], joinsArray) {
    const params: any[] = [];
    sorts.forEach((sort) => {
      this.validateHasColumn(sort.field);
      if (sort.field.indexOf('.') === -1) {
        params.push([sort.field, sort.order]);
      } else {
        const column: string = sort.field.split('.').pop();
        const associationName = sort.field.substr(0, sort.field.lastIndexOf('.'));
        const relation = this.findRelation(associationName);
        /* istanbul ignore else */
        if (relation && joinsArray.indexOf(associationName) !== -1) {
          let names = [];
          const modelList = associationName.split('.').map((k) => {
            names.push(k);
            const relation = this.findRelation(names.join('.'));
            return {
              model: relation.target,
              as: relation.as,
            };
          });
          params.push([...modelList, column, sort.order]);
        }
      }
    });
    return params;
  }

  private getSelect(query: ParsedRequestParams, options: QueryOptions): string[] {
    const allowed = this.getAllowedColumns(this.entityColumns, options);
    const columns =
      query.fields && query.fields.length
        ? query.fields.filter((field) => allowed.some((col) => field === col))
        : allowed;

    return [
      ...(options.persist && options.persist.length ? options.persist : []),
      ...columns,
      ...this.entityPrimaryColumns,
    ];
  }

  private getAllowedColumns(columns: string[], options: QueryOptions): string[] {
    return (!options.exclude || !options.exclude.length) &&
      (!options.allow || /* istanbul ignore next */ !options.allow.length)
      ? columns
      : columns.filter(
          (column) =>
            (options.exclude && options.exclude.length
              ? !options.exclude.some((col) => col === column)
              : /* istanbul ignore next */ true) &&
            (options.allow && options.allow.length
              ? options.allow.some((col) => col === column)
              : /* istanbul ignore next */ true),
        );
  }

  protected createInclude(
    cond: QueryJoin,
    joinOptions: JoinOptions,
  ): Sequelize.IncludeOptions | undefined {
    /* istanbul ignore else */
    if (cond.field && joinOptions[cond.field]) {
      const relation = this.findRelation(cond.field);
      /* istanbul ignore if */
      if (!relation) {
        return;
      }
      const options = joinOptions[cond.field];
      const allowed = this.getAllowedColumns(
        Object.keys(relation.target.rawAttributes),
        options,
      );

      /* istanbul ignore if */
      if (!allowed.length) {
        return;
      }

      const columns =
        !cond.select || !cond.select.length
          ? allowed
          : cond.select.filter((col) => allowed.some((a) => a === col));

      const attributes = [
        ..._.map(relation.target.rawAttributes, (v) => v)
          .filter((column) => column.primaryKey)
          .map((column) => column.field),
        ...(options.persist && options.persist.length ? options.persist : []),
        ...columns,
      ];
      return {
        association: cond.field,
        attributes,
        ...(!options || !options.required ? {} : { required: true }),
        ...(!options || !options.alias ? {} : { as: options.alias }),
      };
    }

    return;
  }

  private validateHasColumn(column: string) {
    if (column.indexOf('.') !== -1) {
      const nests = column.split('.');
      column = nests[nests.length - 1];
      const associationName = nests.slice(0, nests.length - 1).join('.');

      const relation = this.findRelation(associationName);
      if (!relation) {
        this.throwBadRequestException(`Invalid relation name '${relation}'`);
      }
      const noColumn = !Object.keys(relation.target.rawAttributes).find(
        (o) => o === column,
      );
      if (noColumn) {
        this.throwBadRequestException(
          `Invalid column name '${column}' for relation '${relation}'`,
        );
      }
    } else {
      if (!this.hasColumn(column)) {
        this.throwBadRequestException(`Invalid column name '${column}'`);
      }
    }
  }

  protected async getOneOrFail(req: CrudRequest, shallow = false): Promise<T> {
    const { parsed, options } = req;
    const query = this.createBuilder(parsed, options);
    if (shallow) {
      query.include = undefined;
    }
    const found = await this.model.findOne(query);

    if (!found) {
      this.throwNotFoundException(this.model.name);
    }

    return found as T;
  }

  private hasColumn(column: string): boolean {
    return !!this.model.rawAttributes[column];
  }

  findRelation(path) {
    const names = path.split('.');
    let association: Sequelize.Association;
    let model: any = this.model;
    for (let i = 0; i < names.length; ++i) {
      /* istanbul ignore else */
      if (model) {
        association = model.associations[names[i]];
        model = association ? association.target : undefined;
      }
    }

    return association;
  }

  private onInitMapEntityColumns() {
    const columns = Object.keys(this.model.rawAttributes).map(
      (key) => this.model.rawAttributes[key],
    );
    this.entityColumns = Object.keys(this.model.rawAttributes).map((column) => {
      this.entityColumnsHash[column] = true;
      return column;
    });
    this.entityPrimaryColumns = columns
      .filter((column) => column.primaryKey)
      .map((column) => column.field);
  }

  protected prepareEntityBeforeSave(dto: T, parsed: CrudRequest['parsed']): T {
    let obj = JSON.parse(JSON.stringify(dto));
    /* istanbul ignore if */
    if (!isObject(obj)) {
      return undefined;
    }

    if (hasLength(parsed.paramsFilter)) {
      for (const filter of parsed.paramsFilter) {
        obj[filter.field] = filter.value;
      }
    }

    /* istanbul ignore if */
    if (!hasLength(objKeys(obj))) {
      return undefined;
    }
    return Object.assign(obj, parsed.authPersist);
  }

  private onInitMapRelations() {
    const result = {};
    Object.keys(this.model.associations).forEach((key) => {
      result[key] = {
        type: this.model.associations[key].associationType,
        columns: Object.keys(this.model.associations[key].target.rawAttributes),
        referencedColumn: this.model.associations[key].foreignKey,
        name: key,
        modelName: this.model.associations[key].target.name,
      };
    });
    this.entityRelationsHash = result;
  }

  get operators() {
    return {
      eq: true,
      ne: true,
      gt: true,
      lt: true,
      gte: true,
      lte: true,
      starts: true,
      ends: true,
      cont: true,
      excl: true,
      in: true,
      notin: true,
      isnull: true,
      notnull: true,
      between: true,
      eqL: true,
      neL: true,
      gtL: true,
      ltL: true,
      gteL: true,
      lteL: true,
      startsL: true,
      endsL: true,
      contL: true,
      exclL: true,
      inL: true,
      notinL: true,
      isnullL: true,
      notnullL: true,
      betweenL: true,
    };
  }

  isOperator(str: string): boolean {
    return this.operators[str.replace('$', '')];
  }

  protected mapOperatorsToQuery(cond: QueryFilter) {
    let obj: {};
    let opKey = cond.operator.replace('$', '') as string;
    switch (opKey) {
      case 'eq':
        obj = {
          [Sequelize.Op.eq]: cond.value,
        };
        break;

      /* istanbul ignore next */
      case 'ne':
        obj = {
          [Sequelize.Op.ne]: cond.value,
        };
        break;

      case 'gt':
        obj = {
          [Sequelize.Op.gt]: cond.value,
        };
        break;

      case 'lt':
        obj = {
          [Sequelize.Op.lt]: cond.value,
        };
        break;

      case 'gte':
        obj = {
          [Sequelize.Op.gte]: cond.value,
        };
        break;

      case 'lte':
        obj = {
          [Sequelize.Op.lte]: cond.value,
        };
        break;

      case 'starts':
        obj = {
          [Sequelize.Op.like]: `${cond.value}%`,
        };
        break;

      case 'ends':
        obj = {
          [Sequelize.Op.like]: `%${cond.value}`,
        };
        break;

      case 'cont':
        obj = {
          [Sequelize.Op.like]: `%${cond.value}%`,
        };
        break;

      case 'excl':
        obj = {
          [Sequelize.Op.notLike]: `%${cond.value}%`,
        };
        break;

      case 'in':
        this.checkFilterIsArray(cond);
        obj = {
          [Sequelize.Op.in]: cond.value,
        };
        break;

      case 'notin':
        this.checkFilterIsArray(cond);
        obj = {
          [Sequelize.Op.notIn]: cond.value,
        };
        break;

      case 'isnull':
        obj = {
          [Sequelize.Op.is]: null,
        };
        break;

      case 'notnull':
        obj = {
          [Sequelize.Op.not]: null,
        };
        break;

      case 'between':
        this.checkFilterIsArray(cond);
        obj = {
          [Sequelize.Op.between]: cond.value,
        };
        break;
      // case insensitive
      case 'eqL':
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col(cond.field)),
              Sequelize.fn('lower', cond.value),
            ),
          ],
        };
        break;

      case 'neL':
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col(cond.field)),
              '!=',
              Sequelize.fn('lower', cond.value),
            ),
          ],
        };
        break;

      case 'startsL':
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col(cond.field)),
              'like',
              Sequelize.fn('lower', `${cond.value}%`),
            ),
          ],
        };
        break;

      case 'endsL':
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col(cond.field)),
              'like',
              Sequelize.fn('lower', `%${cond.value}`),
            ),
          ],
        };
        break;

      case 'contL':
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col(cond.field)),
              'like',
              Sequelize.fn('lower', `%${cond.value}%`),
            ),
          ],
        };
        break;

      case 'exclL':
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(
              Sequelize.fn('lower', Sequelize.col(cond.field)),
              'not like',
              Sequelize.fn('lower', `%${cond.value}%`),
            ),
          ],
        };
        break;

      case 'inL':
        this.checkFilterIsArray(cond);
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(Sequelize.fn('lower', Sequelize.col(cond.field)), 'in', {
              [Sequelize.Op.in]: cond.value.map((value) => value.toLowerCase()),
            }),
          ],
        };
        break;

      case 'notinL':
        this.checkFilterIsArray(cond);
        obj = {
          [Sequelize.Op.and]: [
            Sequelize.where(Sequelize.fn('lower', Sequelize.col(cond.field)), 'not in', {
              [Sequelize.Op.notIn]: cond.value.map((value) => value.toLowerCase()),
            }),
          ],
        };
        break;

      /* istanbul ignore next */
      default:
        obj = {
          [Sequelize.Op.eq]: cond.value,
        };
        break;
    }
    return { field: cond.field, obj };
  }

  private checkFilterIsArray(cond: QueryFilter, withLength?: boolean) {
    /* istanbul ignore if */
    if (
      !Array.isArray(cond.value) ||
      !cond.value.length ||
      (!isNil(withLength) ? /* istanbul ignore next */ withLength : false)
    ) {
      this.throwBadRequestException(`Invalid column '${cond.field}' value`);
    }
  }

  private transformDto(dto: T) {
    return JSON.parse(JSON.stringify(dto instanceof Model ? classToPlain(dto) : dto));
  }
}

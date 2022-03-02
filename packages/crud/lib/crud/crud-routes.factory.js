"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const route_paramtypes_enum_1 = require("@nestjs/common/enums/route-paramtypes.enum");
const util_1 = require("@nestjsx/util");
const deepmerge = require("deepmerge");
const reflection_helper_1 = require("./reflection.helper");
const serialize_helper_1 = require("./serialize.helper");
const swagger_helper_1 = require("./swagger.helper");
const validation_helper_1 = require("./validation.helper");
const interceptors_1 = require("../interceptors");
const enums_1 = require("../enums");
const module_1 = require("../module");
class CrudRoutesFactory {
    constructor(target, options) {
        this.target = target;
        this.swaggerModels = {};
        this.options = options;
        this.create();
    }
    static create(target, options) {
        return new CrudRoutesFactory(target, options);
    }
    get targetProto() {
        return this.target.prototype;
    }
    get modelName() {
        return this.options.model.type.name;
    }
    get modelType() {
        return this.options.model.type;
    }
    get actionsMap() {
        return {
            getManyBase: enums_1.CrudActions.ReadAll,
            getOneBase: enums_1.CrudActions.ReadOne,
            createManyBase: enums_1.CrudActions.CreateMany,
            createOneBase: enums_1.CrudActions.CreateOne,
            updateOneBase: enums_1.CrudActions.UpdateOne,
            deleteOneBase: enums_1.CrudActions.DeleteOne,
            replaceOneBase: enums_1.CrudActions.ReplaceOne,
            recoverOneBase: enums_1.CrudActions.RecoverOne,
        };
    }
    create() {
        const routesSchema = this.getRoutesSchema();
        this.mergeOptions();
        this.setResponseModels();
        this.createRoutes(routesSchema);
        this.overrideRoutes(routesSchema);
        this.enableRoutes(routesSchema);
    }
    mergeOptions() {
        const authOptions = reflection_helper_1.R.getCrudAuthOptions(this.target);
        this.options.auth = util_1.isObjectFull(authOptions) ? authOptions : {};
        if (util_1.isUndefined(this.options.auth.property)) {
            this.options.auth.property = module_1.CrudConfigService.config.auth.property;
        }
        const query = util_1.isObjectFull(this.options.query) ? this.options.query : {};
        this.options.query = { ...module_1.CrudConfigService.config.query, ...query };
        const routes = util_1.isObjectFull(this.options.routes) ? this.options.routes : {};
        this.options.routes = deepmerge(module_1.CrudConfigService.config.routes, routes, {
            arrayMerge: (a, b, c) => b,
        });
        this.options.params = util_1.isObjectFull(this.options.params)
            ? this.options.params
            : util_1.isObjectFull(module_1.CrudConfigService.config.params)
                ? module_1.CrudConfigService.config.params
                : {};
        const hasPrimary = this.getPrimaryParams().length > 0;
        if (!hasPrimary) {
            this.options.params['id'] = {
                field: 'id',
                type: 'number',
                primary: true,
            };
        }
        if (!util_1.isObjectFull(this.options.dto)) {
            this.options.dto = {};
        }
        const serialize = util_1.isObjectFull(this.options.serialize) ? this.options.serialize : {};
        this.options.serialize = { ...module_1.CrudConfigService.config.serialize, ...serialize };
        this.options.serialize.get = util_1.isFalse(this.options.serialize.get)
            ? false
            : this.options.serialize.get || this.modelType;
        this.options.serialize.getMany = util_1.isFalse(this.options.serialize.getMany)
            ? false
            : this.options.serialize.getMany
                ? this.options.serialize.getMany
                : util_1.isFalse(this.options.serialize.get)
                    ? false
                    : serialize_helper_1.SerializeHelper.createGetManyDto(this.options.serialize.get, this.modelName);
        this.options.serialize.create = util_1.isFalse(this.options.serialize.create)
            ? false
            : this.options.serialize.create || this.modelType;
        this.options.serialize.update = util_1.isFalse(this.options.serialize.update)
            ? false
            : this.options.serialize.update || this.modelType;
        this.options.serialize.replace = util_1.isFalse(this.options.serialize.replace)
            ? false
            : this.options.serialize.replace || this.modelType;
        this.options.serialize.delete =
            util_1.isFalse(this.options.serialize.delete) ||
                !this.options.routes.deleteOneBase.returnDeleted
                ? false
                : this.options.serialize.delete || this.modelType;
        reflection_helper_1.R.setCrudOptions(this.options, this.target);
    }
    getRoutesSchema() {
        return [
            {
                name: 'getOneBase',
                path: '/',
                method: common_1.RequestMethod.GET,
                enable: false,
                override: false,
                withParams: true,
            },
            {
                name: 'getManyBase',
                path: '/',
                method: common_1.RequestMethod.GET,
                enable: false,
                override: false,
                withParams: false,
            },
            {
                name: 'createOneBase',
                path: '/',
                method: common_1.RequestMethod.POST,
                enable: false,
                override: false,
                withParams: false,
            },
            {
                name: 'createManyBase',
                path: '/bulk',
                method: common_1.RequestMethod.POST,
                enable: false,
                override: false,
                withParams: false,
            },
            {
                name: 'updateOneBase',
                path: '/',
                method: common_1.RequestMethod.PATCH,
                enable: false,
                override: false,
                withParams: true,
            },
            {
                name: 'replaceOneBase',
                path: '/',
                method: common_1.RequestMethod.PUT,
                enable: false,
                override: false,
                withParams: true,
            },
            {
                name: 'deleteOneBase',
                path: '/',
                method: common_1.RequestMethod.DELETE,
                enable: false,
                override: false,
                withParams: true,
            },
            {
                name: 'recoverOneBase',
                path: '/recover',
                method: common_1.RequestMethod.PATCH,
                enable: false,
                override: false,
                withParams: true,
            },
        ];
    }
    getManyBase(name) {
        this.targetProto[name] = function getManyBase(req) {
            return this.service.getMany(req);
        };
    }
    getOneBase(name) {
        this.targetProto[name] = function getOneBase(req) {
            return this.service.getOne(req);
        };
    }
    createOneBase(name) {
        this.targetProto[name] = function createOneBase(req, dto) {
            return this.service.createOne(req, dto);
        };
    }
    createManyBase(name) {
        this.targetProto[name] = function createManyBase(req, dto) {
            return this.service.createMany(req, dto);
        };
    }
    updateOneBase(name) {
        this.targetProto[name] = function updateOneBase(req, dto) {
            return this.service.updateOne(req, dto);
        };
    }
    replaceOneBase(name) {
        this.targetProto[name] = function replaceOneBase(req, dto) {
            return this.service.replaceOne(req, dto);
        };
    }
    deleteOneBase(name) {
        this.targetProto[name] = function deleteOneBase(req) {
            return this.service.deleteOne(req);
        };
    }
    recoverOneBase(name) {
        this.targetProto[name] = function recoverOneBase(req) {
            return this.service.recoverOne(req);
        };
    }
    canCreateRoute(name) {
        const only = this.options.routes.only;
        const exclude = this.options.routes.exclude;
        if (name === 'recoverOneBase' && this.options.query.softDelete !== true) {
            return false;
        }
        if (util_1.isArrayFull(only)) {
            return only.some((route) => route === name);
        }
        if (util_1.isArrayFull(exclude)) {
            return !exclude.some((route) => route === name);
        }
        return true;
    }
    setResponseModels() {
        const modelType = util_1.isFunction(this.modelType)
            ? this.modelType
            : serialize_helper_1.SerializeHelper.createGetOneResponseDto(this.modelName);
        this.swaggerModels.get = util_1.isFunction(this.options.serialize.get)
            ? this.options.serialize.get
            : modelType;
        this.swaggerModels.getMany =
            this.options.serialize.getMany ||
                serialize_helper_1.SerializeHelper.createGetManyDto(this.swaggerModels.get, this.modelName);
        this.swaggerModels.create = util_1.isFunction(this.options.serialize.create)
            ? this.options.serialize.create
            : modelType;
        this.swaggerModels.update = util_1.isFunction(this.options.serialize.update)
            ? this.options.serialize.update
            : modelType;
        this.swaggerModels.replace = util_1.isFunction(this.options.serialize.replace)
            ? this.options.serialize.replace
            : modelType;
        this.swaggerModels.delete = util_1.isFunction(this.options.serialize.delete)
            ? this.options.serialize.delete
            : modelType;
        this.swaggerModels.recover = util_1.isFunction(this.options.serialize.recover)
            ? this.options.serialize.recover
            : modelType;
        swagger_helper_1.Swagger.setExtraModels(this.swaggerModels);
    }
    createRoutes(routesSchema) {
        const primaryParams = this.getPrimaryParams().filter((param) => !this.options.params[param].disabled);
        routesSchema.forEach((route) => {
            if (this.canCreateRoute(route.name)) {
                this[route.name](route.name);
                route.enable = true;
                this.setBaseRouteMeta(route.name);
            }
            if (route.withParams && primaryParams.length > 0) {
                route.path =
                    route.path !== '/'
                        ? `${primaryParams.map((param) => `/:${param}`).join('')}${route.path}`
                        : primaryParams.map((param) => `/:${param}`).join('');
            }
        });
    }
    overrideRoutes(routesSchema) {
        util_1.getOwnPropNames(this.targetProto).forEach((name) => {
            const override = reflection_helper_1.R.getOverrideRoute(this.targetProto[name]);
            const route = routesSchema.find((r) => util_1.isEqual(r.name, override));
            if (override && route && route.enable) {
                const interceptors = reflection_helper_1.R.getInterceptors(this.targetProto[name]);
                const baseInterceptors = reflection_helper_1.R.getInterceptors(this.targetProto[override]);
                const baseAction = reflection_helper_1.R.getAction(this.targetProto[override]);
                const operation = swagger_helper_1.Swagger.getOperation(this.targetProto[name]);
                const baseOperation = swagger_helper_1.Swagger.getOperation(this.targetProto[override]);
                const swaggerParams = swagger_helper_1.Swagger.getParams(this.targetProto[name]);
                const baseSwaggerParams = swagger_helper_1.Swagger.getParams(this.targetProto[override]);
                const responseOk = swagger_helper_1.Swagger.getResponseOk(this.targetProto[name]);
                const baseResponseOk = swagger_helper_1.Swagger.getResponseOk(this.targetProto[override]);
                reflection_helper_1.R.setInterceptors([...baseInterceptors, ...interceptors], this.targetProto[name]);
                reflection_helper_1.R.setAction(baseAction, this.targetProto[name]);
                swagger_helper_1.Swagger.setOperation({ ...baseOperation, ...operation }, this.targetProto[name]);
                swagger_helper_1.Swagger.setParams([...baseSwaggerParams, ...swaggerParams], this.targetProto[name]);
                swagger_helper_1.Swagger.setResponseOk({ ...baseResponseOk, ...responseOk }, this.targetProto[name]);
                this.overrideParsedBodyDecorator(override, name);
                reflection_helper_1.R.setRoute(route, this.targetProto[name]);
                route.override = true;
            }
        });
    }
    enableRoutes(routesSchema) {
        routesSchema.forEach((route) => {
            if (!route.override && route.enable) {
                reflection_helper_1.R.setRoute(route, this.targetProto[route.name]);
            }
        });
    }
    overrideParsedBodyDecorator(override, name) {
        const allowed = [
            'createManyBase',
            'createOneBase',
            'updateOneBase',
            'replaceOneBase',
        ];
        const withBody = util_1.isIn(override, allowed);
        const parsedBody = reflection_helper_1.R.getParsedBody(this.targetProto[name]);
        if (withBody && parsedBody) {
            const baseKey = `${route_paramtypes_enum_1.RouteParamtypes.BODY}:1`;
            const key = `${route_paramtypes_enum_1.RouteParamtypes.BODY}:${parsedBody.index}`;
            const baseRouteArgs = reflection_helper_1.R.getRouteArgs(this.target, override);
            const routeArgs = reflection_helper_1.R.getRouteArgs(this.target, name);
            const baseBodyArg = baseRouteArgs[baseKey];
            reflection_helper_1.R.setRouteArgs({
                ...routeArgs,
                [key]: {
                    ...baseBodyArg,
                    index: parsedBody.index,
                },
            }, this.target, name);
            if (util_1.isEqual(override, 'createManyBase')) {
                const paramTypes = reflection_helper_1.R.getRouteArgsTypes(this.targetProto, name);
                const metatype = paramTypes[parsedBody.index];
                const types = [String, Boolean, Number, Array, Object];
                const toCopy = util_1.isIn(metatype, types) || util_1.isNil(metatype);
                if (toCopy) {
                    const baseParamTypes = reflection_helper_1.R.getRouteArgsTypes(this.targetProto, override);
                    const baseMetatype = baseParamTypes[1];
                    paramTypes.splice(parsedBody.index, 1, baseMetatype);
                    reflection_helper_1.R.setRouteArgsTypes(paramTypes, this.targetProto, name);
                }
            }
        }
    }
    getPrimaryParams() {
        return util_1.objKeys(this.options.params).filter((param) => this.options.params[param] && this.options.params[param].primary);
    }
    setBaseRouteMeta(name) {
        this.setRouteArgs(name);
        this.setRouteArgsTypes(name);
        this.setInterceptors(name);
        this.setAction(name);
        this.setSwaggerOperation(name);
        this.setSwaggerPathParams(name);
        this.setSwaggerQueryParams(name);
        this.setSwaggerResponseOk(name);
        this.setDecorators(name);
    }
    setRouteArgs(name) {
        let rest = {};
        const routes = [
            'createManyBase',
            'createOneBase',
            'updateOneBase',
            'replaceOneBase',
        ];
        if (util_1.isIn(name, routes)) {
            const action = this.routeNameAction(name);
            const hasDto = !util_1.isNil(this.options.dto[action]);
            const { UPDATE, CREATE } = enums_1.CrudValidationGroups;
            const groupEnum = util_1.isIn(name, ['updateOneBase', 'replaceOneBase']) ? UPDATE : CREATE;
            const group = !hasDto ? groupEnum : undefined;
            rest = reflection_helper_1.R.setBodyArg(1, [validation_helper_1.Validation.getValidationPipe(this.options, group)]);
        }
        reflection_helper_1.R.setRouteArgs({ ...reflection_helper_1.R.setParsedRequestArg(0), ...rest }, this.target, name);
    }
    setRouteArgsTypes(name) {
        if (util_1.isEqual(name, 'createManyBase')) {
            const bulkDto = validation_helper_1.Validation.createBulkDto(this.options);
            reflection_helper_1.R.setRouteArgsTypes([Object, bulkDto], this.targetProto, name);
        }
        else if (util_1.isIn(name, ['createOneBase', 'updateOneBase', 'replaceOneBase'])) {
            const action = this.routeNameAction(name);
            const dto = this.options.dto[action] || this.modelType;
            reflection_helper_1.R.setRouteArgsTypes([Object, dto], this.targetProto, name);
        }
        else {
            reflection_helper_1.R.setRouteArgsTypes([Object], this.targetProto, name);
        }
    }
    setInterceptors(name) {
        const interceptors = this.options.routes[name].interceptors;
        reflection_helper_1.R.setInterceptors([
            interceptors_1.CrudRequestInterceptor,
            interceptors_1.CrudResponseInterceptor,
            ...(util_1.isArrayFull(interceptors) ? interceptors : []),
        ], this.targetProto[name]);
    }
    setDecorators(name) {
        const decorators = this.options.routes[name].decorators;
        reflection_helper_1.R.setDecorators(util_1.isArrayFull(decorators) ? decorators : [], this.targetProto, name);
    }
    setAction(name) {
        reflection_helper_1.R.setAction(this.actionsMap[name], this.targetProto[name]);
    }
    setSwaggerOperation(name) {
        const summary = swagger_helper_1.Swagger.operationsMap(this.modelName)[name];
        const operationId = name + this.targetProto.constructor.name + this.modelName;
        swagger_helper_1.Swagger.setOperation({ summary, operationId }, this.targetProto[name]);
    }
    setSwaggerPathParams(name) {
        const metadata = swagger_helper_1.Swagger.getParams(this.targetProto[name]);
        const withoutPrimary = [
            'createManyBase',
            'createOneBase',
            'getManyBase',
        ];
        const removePrimary = util_1.isIn(name, withoutPrimary);
        const params = util_1.objKeys(this.options.params)
            .filter((key) => !this.options.params[key].disabled)
            .filter((key) => !(removePrimary && this.options.params[key].primary))
            .reduce((a, c) => ({ ...a, [c]: this.options.params[c] }), {});
        const pathParamsMeta = swagger_helper_1.Swagger.createPathParamsMeta(params);
        swagger_helper_1.Swagger.setParams([...metadata, ...pathParamsMeta], this.targetProto[name]);
    }
    setSwaggerQueryParams(name) {
        const metadata = swagger_helper_1.Swagger.getParams(this.targetProto[name]);
        const queryParamsMeta = swagger_helper_1.Swagger.createQueryParamsMeta(name, this.options);
        swagger_helper_1.Swagger.setParams([...metadata, ...queryParamsMeta], this.targetProto[name]);
    }
    setSwaggerResponseOk(name) {
        const metadata = swagger_helper_1.Swagger.getResponseOk(this.targetProto[name]);
        const metadataToAdd = swagger_helper_1.Swagger.createResponseMeta(name, this.options, this.swaggerModels) ||
            {};
        swagger_helper_1.Swagger.setResponseOk({ ...metadata, ...metadataToAdd }, this.targetProto[name]);
    }
    routeNameAction(name) {
        return (name.split('OneBase')[0] || name.split('ManyBase')[0]);
    }
}
exports.CrudRoutesFactory = CrudRoutesFactory;
//# sourceMappingURL=crud-routes.factory.js.map
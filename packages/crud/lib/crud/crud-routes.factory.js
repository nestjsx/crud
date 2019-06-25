"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const route_paramtypes_enum_1 = require("@nestjs/common/enums/route-paramtypes.enum");
const util_1 = require("@nestjsx/util");
const deepmerge = require("deepmerge");
const reflection_helper_1 = require("./reflection.helper");
const swagger_helper_1 = require("./swagger.helper");
const validation_helper_1 = require("./validation.helper");
const interceptors_1 = require("../interceptors");
const enums_1 = require("../enums");
const module_1 = require("../module");
class CrudRoutesFactory {
    constructor(target, options) {
        this.target = target;
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
        };
    }
    create() {
        const routesSchema = this.getRoutesSchema();
        this.mergeOptions();
        this.createRoutes(routesSchema);
        this.overrideRoutes(routesSchema);
        this.enableRoutes(routesSchema);
    }
    mergeOptions() {
        const query = util_1.isObjectFull(this.options.query) ? this.options.query : {};
        this.options.query = Object.assign({}, module_1.CrudConfigService.config.query, query);
        const routes = util_1.isObjectFull(this.options.routes) ? this.options.routes : {};
        this.options.routes = deepmerge(module_1.CrudConfigService.config.routes, routes, {
            arrayMerge: (a, b, c) => b,
        });
        const params = util_1.isObjectFull(this.options.params) ? this.options.params : {};
        this.options.params = Object.assign({}, module_1.CrudConfigService.config.params, params);
        reflection_helper_1.R.setCrudOptions(this.options, this.target);
    }
    getRoutesSchema() {
        return [
            {
                name: 'getManyBase',
                path: '/',
                method: common_1.RequestMethod.GET,
                enable: false,
                override: false,
            },
            {
                name: 'getOneBase',
                path: '',
                method: common_1.RequestMethod.GET,
                enable: false,
                override: false,
            },
            {
                name: 'createOneBase',
                path: '/',
                method: common_1.RequestMethod.POST,
                enable: false,
                override: false,
            },
            {
                name: 'createManyBase',
                path: '/bulk',
                method: common_1.RequestMethod.POST,
                enable: false,
                override: false,
            },
            {
                name: 'updateOneBase',
                path: '',
                method: common_1.RequestMethod.PATCH,
                enable: false,
                override: false,
            },
            {
                name: 'replaceOneBase',
                path: '',
                method: common_1.RequestMethod.PUT,
                enable: false,
                override: false,
            },
            {
                name: 'deleteOneBase',
                path: '',
                method: common_1.RequestMethod.DELETE,
                enable: false,
                override: false,
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
    canCreateRoute(name) {
        const only = this.options.routes.only;
        const exclude = this.options.routes.exclude;
        if (util_1.isArrayFull(only)) {
            return only.some((route) => route === name);
        }
        if (util_1.isArrayFull(exclude)) {
            return !exclude.some((route) => route === name);
        }
        return true;
    }
    createRoutes(routesSchema) {
        const primaryParam = this.getPrimaryParam();
        routesSchema.forEach((route) => {
            if (this.canCreateRoute(route.name)) {
                this[route.name](route.name);
                route.enable = true;
                this.setBaseRouteMeta(route.name);
            }
            if (!util_1.hasLength(route.path)) {
                route.path = `/:${primaryParam}`;
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
                const baseSwaggerParams = swagger_helper_1.Swagger.getParams(this.targetProto[override]);
                const baseResponseOk = swagger_helper_1.Swagger.getResponseOk(this.targetProto[override]);
                reflection_helper_1.R.setInterceptors([...baseInterceptors, ...interceptors], this.targetProto[name]);
                reflection_helper_1.R.setAction(baseAction, this.targetProto[name]);
                swagger_helper_1.Swagger.setOperation(override, this.modelName, this.targetProto[name]);
                swagger_helper_1.Swagger.setParams(baseSwaggerParams, this.targetProto[name]);
                swagger_helper_1.Swagger.setResponseOk(baseResponseOk, this.targetProto[name]);
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
            reflection_helper_1.R.setRouteArgs(Object.assign({}, routeArgs, { [key]: Object.assign({}, baseBodyArg, { index: parsedBody.index }) }), this.target, name);
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
    getPrimaryParam() {
        return util_1.objKeys(this.options.params).find((param) => this.options.params[param].primary);
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
        const toValidate = [
            'createManyBase',
            'createOneBase',
            'updateOneBase',
            'replaceOneBase',
        ];
        if (util_1.isIn(name, toValidate)) {
            const group = util_1.isEqual(name, 'updateOneBase') || util_1.isEqual(name, 'replaceOneBase')
                ? enums_1.CrudValidationGroups.UPDATE
                : enums_1.CrudValidationGroups.CREATE;
            rest = reflection_helper_1.R.setBodyArg(1, [validation_helper_1.Validation.getValidationPipe(this.options, group)]);
        }
        reflection_helper_1.R.setRouteArgs(Object.assign({}, reflection_helper_1.R.setParsedRequestArg(0), rest), this.target, name);
    }
    setRouteArgsTypes(name) {
        if (util_1.isEqual(name, 'createManyBase')) {
            const bulkDto = validation_helper_1.Validation.createBulkDto(this.options);
            reflection_helper_1.R.setRouteArgsTypes([Object, bulkDto], this.targetProto, name);
        }
        else if (util_1.isEqual(name, 'createOneBase') ||
            util_1.isEqual(name, 'updateOneBase') ||
            util_1.isEqual(name, 'replaceOneBase')) {
            reflection_helper_1.R.setRouteArgsTypes([Object, this.modelType], this.targetProto, name);
        }
        else {
            reflection_helper_1.R.setRouteArgsTypes([Object], this.targetProto, name);
        }
    }
    setInterceptors(name) {
        const interceptors = this.options.routes[name].interceptors;
        reflection_helper_1.R.setInterceptors([
            interceptors_1.CrudRequestInterceptor,
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
        swagger_helper_1.Swagger.setOperation(name, this.modelName, this.targetProto[name]);
    }
    setSwaggerPathParams(name) {
        const metadata = swagger_helper_1.Swagger.getParams(this.targetProto[name]);
        const withoutPrimary = [
            'createManyBase',
            'createOneBase',
            'getManyBase',
        ];
        const params = util_1.isIn(name, withoutPrimary)
            ? util_1.objKeys(this.options.params).reduce((a, c) => this.options.params[c].primary ? a : Object.assign({}, a, { [c]: this.options.params[c] }), {})
            : this.options.params;
        const pathParamsMeta = swagger_helper_1.Swagger.createPathParasmMeta(params);
        swagger_helper_1.Swagger.setParams([...metadata, ...pathParamsMeta], this.targetProto[name]);
    }
    setSwaggerQueryParams(name) {
        const metadata = swagger_helper_1.Swagger.getParams(this.targetProto[name]);
        const queryParamsMeta = swagger_helper_1.Swagger.createQueryParamsMeta(name);
        swagger_helper_1.Swagger.setParams([...metadata, ...queryParamsMeta], this.targetProto[name]);
    }
    setSwaggerResponseOk(name) {
        const status = util_1.isEqual(name, 'createManyBase') || util_1.isEqual(name, 'createOneBase')
            ? common_1.HttpStatus.CREATED
            : common_1.HttpStatus.OK;
        const isArray = util_1.isEqual(name, 'createManyBase') || util_1.isEqual(name, 'getManyBase');
        const metadata = swagger_helper_1.Swagger.getResponseOk(this.targetProto[name]);
        const responseOkMeta = swagger_helper_1.Swagger.createReponseOkMeta(status, isArray, this.modelType);
        swagger_helper_1.Swagger.setResponseOk(Object.assign({}, metadata, responseOkMeta), this.targetProto[name]);
    }
}
exports.CrudRoutesFactory = CrudRoutesFactory;
//# sourceMappingURL=crud-routes.factory.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const util_1 = require("@nestjsx/util");
const reflection_helper_1 = require("./reflection.helper");
const swagger_helper_1 = require("./swagger.helper");
const interceptors_1 = require("../interceptors");
const enums_1 = require("../enums");
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
    get actionsMap() {
        return {
            getManyBase: enums_1.CrudActions.ReadAll,
            getOneBase: enums_1.CrudActions.ReadOne,
            createManyBase: enums_1.CrudActions.CreateMany,
            createOneBase: enums_1.CrudActions.CreateOne,
            updateOneBase: enums_1.CrudActions.UpdateOne,
            deleteOneBase: enums_1.CrudActions.DeleteOne,
        };
    }
    create() {
        const routesSchema = this.getRoutesSchema();
        this.setOptionsDefaults();
        this.createRoutes(routesSchema);
        this.overrideRoutes(routesSchema);
        this.enableRoutes(routesSchema);
    }
    setOptionsDefaults() {
        if (!util_1.isObjectFull(this.options.model)) {
            this.options.model = {
                type: {},
                service: 'typeorm',
            };
        }
        if (!util_1.isObjectFull(this.options.params)) {
            this.options.params = {
                id: {
                    field: 'id',
                    type: 'number',
                    primary: true,
                },
            };
        }
        if (!util_1.isObjectFull(this.options.routes)) {
            this.options.routes = {};
        }
        if (!util_1.isObjectFull(this.options.routes.getManyBase)) {
            this.options.routes.getManyBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(this.options.routes.getOneBase)) {
            this.options.routes.getOneBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(this.options.routes.createOneBase)) {
            this.options.routes.createOneBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(this.options.routes.createManyBase)) {
            this.options.routes.createManyBase = { interceptors: [], decorators: [] };
        }
        if (!util_1.isObjectFull(this.options.routes.updateOneBase)) {
            this.options.routes.updateOneBase = {
                allowParamsOverride: false,
                interceptors: [],
                decorators: [],
            };
        }
        if (!util_1.isObjectFull(this.options.routes.deleteOneBase)) {
            this.options.routes.deleteOneBase = {
                returnDeleted: false,
                interceptors: [],
                decorators: [],
            };
        }
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
                name: 'deleteOneBase',
                path: '',
                method: common_1.RequestMethod.DELETE,
                enable: false,
                override: false,
            },
        ];
    }
    getManyBase(name) {
        this.targetProto[name] = function getManyBase(parsedRequest) {
            return [];
        };
    }
    getOneBase(name) {
        this.targetProto[name] = function getOneBase(parsedRequest) {
            return [];
        };
    }
    createOneBase(name) {
        this.targetProto[name] = function createOneBase(parsedRequest) {
            return [];
        };
    }
    createManyBase(name) {
        this.targetProto[name] = function createManyBase(parsedRequest) {
            return [];
        };
    }
    updateOneBase(name) {
        this.targetProto[name] = function updateOneBase(parsedRequest) {
            return [];
        };
    }
    deleteOneBase(name) {
        this.targetProto[name] = function deleteOneBase(parsedRequest) {
            return [];
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
                const { name } = route;
                this[name](name);
                route.enable = true;
                this.setArgs(name);
                this.setInterceptors(name);
                this.setAction(name);
                this.setSwaggerOperation(name);
                this.setSwaggerParams(name);
            }
            if (!util_1.hasLength(route.path)) {
                route.path = `/:${primaryParam}`;
            }
        });
    }
    overrideRoutes(routesSchema) {
    }
    enableRoutes(routesSchema) {
        routesSchema.forEach((route) => {
            if (!route.override && route.enable) {
                reflection_helper_1.R.setRoute(route, this.targetProto[route.name]);
            }
        });
    }
    getPrimaryParam() {
        return util_1.objKeys(this.options.params).find((param) => this.options.params[param].primary);
    }
    setArgs(name, rest = {}) {
        reflection_helper_1.R.setRouteArgs(Object.assign({}, reflection_helper_1.R.setParsedRequest(0), rest), this.target, name);
    }
    setInterceptors(name) {
        const interceptors = this.options.routes[name].interceptors;
        reflection_helper_1.R.setInterceptors([interceptors_1.CrudRequestInterceptor, ...(util_1.isArrayFull(interceptors) ? interceptors : [])], this.targetProto[name]);
    }
    setAction(name) {
        reflection_helper_1.R.setAction(this.actionsMap[name], this.targetProto[name]);
    }
    setSwaggerOperation(name) {
        swagger_helper_1.Swagger.setOperation(name, this.modelName, this.targetProto[name]);
    }
    setSwaggerParams(name) {
        const metadata = swagger_helper_1.Swagger.getParams(this.targetProto[name]);
        const pathParamsMeta = swagger_helper_1.Swagger.createPathParamMeta(this.options.params);
        swagger_helper_1.Swagger.setParams([...metadata, pathParamsMeta], this.targetProto[name]);
    }
}
exports.CrudRoutesFactory = CrudRoutesFactory;
//# sourceMappingURL=crud-routes.factory.js.map
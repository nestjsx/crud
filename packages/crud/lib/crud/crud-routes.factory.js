"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const util_1 = require("@nestjsx/util");
const reflection_helper_1 = require("./reflection.helper");
const interceptors_1 = require("../interceptors");
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
    create() {
        this.setOptionsDefaults();
        this.onModuleInit();
        const routesSchema = this.getRoutesSchema();
        this.createRoutes(routesSchema);
        this.overrideRoutes(routesSchema);
        this.enableRoutes(routesSchema);
    }
    onModuleInit() {
        const options = this.options;
        this.targetProto['onModuleInit'] = function onModuleInit() {
            this.service.options = options;
        };
    }
    setOptionsDefaults() {
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
    getManyBase() {
        const name = 'getManyBase';
        this.targetProto[name] = function getManyBase() {
            return [];
        };
        reflection_helper_1.R.setInterceptors([interceptors_1.CrudRequestInterceptor], this.targetProto[name]);
    }
    getOneBase() {
        const name = 'getOneBase';
        this.targetProto[name] = function getOneBase() {
            return {};
        };
        reflection_helper_1.R.setInterceptors([interceptors_1.CrudRequestInterceptor], this.targetProto[name]);
    }
    createOneBase() {
        const name = 'createOneBase';
        this.targetProto[name] = function createOneBase() {
            return [];
        };
    }
    createManyBase() {
        const name = 'createManyBase';
        this.targetProto[name] = function createManyBase() {
            return [];
        };
    }
    updateOneBase() {
        const name = 'updateOneBase';
        this.targetProto[name] = function updateOneBase() {
            return [];
        };
    }
    deleteOneBase() {
        const name = 'deleteOneBase';
        this.targetProto[name] = function deleteOneBase() {
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
                this[route.name]();
                route.enable = true;
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
}
exports.CrudRoutesFactory = CrudRoutesFactory;
//# sourceMappingURL=crud-routes.factory.js.map
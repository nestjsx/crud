"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const route_paramtypes_enum_1 = require("@nestjs/common/enums/route-paramtypes.enum");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const dto_1 = require("../dto");
const enums_1 = require("../enums");
const interceptors_1 = require("../interceptors");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const helpers_1 = require("./helpers");
const baseRoutesInit = {
    getManyBase(target, name, dto, crudOptions) {
        const prototype = target.prototype;
        prototype[name] = function getManyBase(query, options) {
            return this.service.getMany(query, options);
        };
        helpers_1.setParams(Object.assign({}, helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_QUERY_REQUEST_KEY, 0), helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_OPTIONS_METADATA, 1)), target, name);
        helpers_1.setParamTypes([dto_1.RestfulParamsDto, Object], prototype, name);
        helpers_1.setInterceptors([
            interceptors_1.RestfulParamsInterceptorFactory(crudOptions),
            interceptors_1.RestfulQueryInterceptor,
            ...getRoutesInterceptors(crudOptions.routes.getManyBase),
        ], prototype[name]);
        helpers_1.setAction(enums_1.CrudActions.ReadAll, prototype[name]);
        helpers_1.setSwaggerParams(prototype[name], crudOptions);
        helpers_1.setSwaggerQueryGetMany(prototype[name], dto.name);
    },
    getOneBase(target, name, dto, crudOptions) {
        const prototype = target.prototype;
        prototype[name] = function getOneBase(query, options) {
            return this.service.getOne(query, options);
        };
        helpers_1.setParams(Object.assign({}, helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_QUERY_REQUEST_KEY, 0), helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_OPTIONS_METADATA, 1)), target, name);
        helpers_1.setParamTypes([dto_1.RestfulParamsDto, Object], prototype, name);
        helpers_1.setInterceptors([
            interceptors_1.RestfulParamsInterceptorFactory(crudOptions),
            interceptors_1.RestfulQueryInterceptor,
            ...getRoutesInterceptors(crudOptions.routes.getOneBase),
        ], prototype[name]);
        helpers_1.setAction(enums_1.CrudActions.ReadOne, prototype[name]);
        helpers_1.setSwaggerParams(prototype[name], crudOptions);
        helpers_1.setSwaggerQueryGetOne(prototype[name], dto.name);
    },
    createOneBase(target, name, dto, crudOptions) {
        const prototype = target.prototype;
        prototype[name] = function createOneBase(params, body) {
            return this.service.createOne(body, params);
        };
        helpers_1.setParams(Object.assign({}, helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_PARAMS_REQUEST_KEY, 0), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1, [
            helpers_1.setValidationPipe(crudOptions, enums_1.CrudValidate.CREATE),
        ])), target, name);
        helpers_1.setParamTypes([Array, dto], prototype, name);
        helpers_1.setInterceptors([
            interceptors_1.RestfulParamsInterceptorFactory(crudOptions),
            ...getRoutesInterceptors(crudOptions.routes.createOneBase),
        ], prototype[name]);
        helpers_1.setAction(enums_1.CrudActions.CreateOne, prototype[name]);
        helpers_1.setSwaggerParams(prototype[name], crudOptions);
    },
    createManyBase(target, name, dto, crudOptions) {
        const prototype = target.prototype;
        prototype[name] = function createManyBase(params, body) {
            return this.service.createMany(body, params);
        };
        const isArray = utils_1.mockValidatorDecorator('isArray');
        const ValidateNested = utils_1.mockValidatorDecorator('ValidateNested');
        const IsNotEmpty = utils_1.mockValidatorDecorator('IsNotEmpty');
        const Type = utils_1.mockTransformerDecorator('Type');
        class BulkDto {
        }
        __decorate([
            isArray({ each: true, groups: [enums_1.CrudValidate.CREATE] }),
            IsNotEmpty({ groups: [enums_1.CrudValidate.CREATE] }),
            ValidateNested({ each: true, groups: [enums_1.CrudValidate.CREATE] }),
            Type((t) => dto),
            __metadata("design:type", Array)
        ], BulkDto.prototype, "bulk", void 0);
        helpers_1.setParams(Object.assign({}, helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_PARAMS_REQUEST_KEY, 0), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1, [
            helpers_1.setValidationPipe(crudOptions, enums_1.CrudValidate.CREATE),
        ])), target, name);
        helpers_1.setParamTypes([Array, utils_1.hasValidator ? BulkDto : {}], prototype, name);
        helpers_1.setInterceptors([
            interceptors_1.RestfulParamsInterceptorFactory(crudOptions),
            ...getRoutesInterceptors(crudOptions.routes.createManyBase),
        ], prototype[name]);
        helpers_1.setAction(enums_1.CrudActions.CreateMany, prototype[name]);
        helpers_1.setSwaggerParams(prototype[name], crudOptions);
    },
    updateOneBase(target, name, dto, crudOptions) {
        const prototype = target.prototype;
        prototype[name] = function updateOneBase(params, body) {
            return this.service.updateOne(body, params, crudOptions.routes);
        };
        helpers_1.setParams(Object.assign({}, helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_PARAMS_REQUEST_KEY, 0), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1, [
            helpers_1.setValidationPipe(crudOptions, enums_1.CrudValidate.UPDATE),
        ])), target, name);
        helpers_1.setParamTypes([Array, dto], prototype, name);
        helpers_1.setInterceptors([
            interceptors_1.RestfulParamsInterceptorFactory(crudOptions),
            ...getRoutesInterceptors(crudOptions.routes.updateOneBase),
        ], prototype[name]);
        helpers_1.setAction(enums_1.CrudActions.UpdateOne, prototype[name]);
        helpers_1.setSwaggerParams(prototype[name], crudOptions);
    },
    deleteOneBase(target, name, crudOptions) {
        const prototype = target.prototype;
        prototype[name] = function deleteOneBase(params) {
            return this.service.deleteOne(params, crudOptions.routes);
        };
        helpers_1.setParams(Object.assign({}, helpers_1.createCustomRequestParamMetadata(constants_1.PARSED_PARAMS_REQUEST_KEY, 0)), target, name);
        helpers_1.setParamTypes([Array], prototype, name);
        helpers_1.setInterceptors([
            interceptors_1.RestfulParamsInterceptorFactory(crudOptions),
            ...getRoutesInterceptors(crudOptions.routes.deleteOneBase),
        ], prototype[name]);
        helpers_1.setAction(enums_1.CrudActions.DeleteOne, prototype[name]);
        helpers_1.setSwaggerParams(prototype[name], crudOptions);
    },
};
const getBaseRoutesSchema = () => ({
    getManyBase: {
        name: 'getManyBase',
        path: '/',
        method: common_1.RequestMethod.GET,
        enable: false,
        override: false,
    },
    getOneBase: {
        name: 'getOneBase',
        path: '',
        method: common_1.RequestMethod.GET,
        enable: false,
        override: false,
    },
    createOneBase: {
        name: 'createOneBase',
        path: '/',
        method: common_1.RequestMethod.POST,
        enable: false,
        override: false,
    },
    createManyBase: {
        name: 'createManyBase',
        path: '/bulk',
        method: common_1.RequestMethod.POST,
        enable: false,
        override: false,
    },
    updateOneBase: {
        name: 'updateOneBase',
        path: '',
        method: common_1.RequestMethod.PATCH,
        enable: false,
        override: false,
    },
    deleteOneBase: {
        name: 'deleteOneBase',
        path: '',
        method: common_1.RequestMethod.DELETE,
        enable: false,
        override: false,
    },
});
exports.Crud = (dto, crudOptions = {}) => (target) => {
    const prototype = target.prototype;
    const baseRoutes = getBaseRoutesSchema();
    const path = helpers_1.getControllerPath(target);
    paramsOptionsInit(crudOptions);
    const slug = getRoutesSlugName(crudOptions, path);
    Object.keys(baseRoutes).forEach((name) => {
        const route = baseRoutes[name];
        if (helpers_1.enableRoute(route.name, crudOptions)) {
            if (!route.path.length) {
                route.path = `/:${slug}`;
            }
            route.name !== 'deleteOneBase'
                ? baseRoutesInit[route.name](target, route.name, dto, crudOptions)
                : baseRoutesInit[route.name](target, route.name, crudOptions);
            route.enable = true;
        }
    });
    Object.getOwnPropertyNames(prototype).forEach((name) => {
        const overrided = helpers_1.getOverrideMetadata(prototype[name]);
        const route = baseRoutes[overrided];
        if (overrided && route && route.enable) {
            const interceptors = helpers_1.getInterceptors(prototype[name]) || [];
            const baseInterceptors = helpers_1.getInterceptors(prototype[overrided]) || [];
            const baseAction = helpers_1.getAction(prototype[overrided]);
            helpers_1.setInterceptors([...baseInterceptors, ...interceptors], prototype[name]);
            helpers_1.setAction(baseAction, prototype[name]);
            helpers_1.setRoute(route.path, route.method, prototype[name]);
            route.override = true;
        }
    });
    Object.keys(baseRoutes).forEach((name) => {
        const route = baseRoutes[name];
        if (!route.override && route.enable) {
            helpers_1.setRoute(route.path, route.method, prototype[route.name]);
        }
    });
};
exports.Override = (name) => (target, key, descriptor) => {
    Reflect.defineMetadata(constants_1.OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
    return descriptor;
};
function paramsOptionsInit(crudOptions) {
    const check = (obj) => shared_utils_1.isNil(obj) || !shared_utils_1.isObject(obj) || !Object.keys(obj).length;
    if (check(crudOptions.params)) {
        crudOptions.params = { id: 'number' };
    }
    if (check(crudOptions.routes)) {
        crudOptions.routes = {};
    }
    if (check(crudOptions.routes.getManyBase)) {
        crudOptions.routes.getManyBase = { interceptors: [] };
    }
    if (check(crudOptions.routes.getOneBase)) {
        crudOptions.routes.getOneBase = { interceptors: [] };
    }
    if (check(crudOptions.routes.createOneBase)) {
        crudOptions.routes.createOneBase = { interceptors: [] };
    }
    if (check(crudOptions.routes.createManyBase)) {
        crudOptions.routes.createManyBase = { interceptors: [] };
    }
    if (check(crudOptions.routes.updateOneBase)) {
        crudOptions.routes.updateOneBase = { allowParamsOverride: false, interceptors: [] };
    }
    if (check(crudOptions.routes.deleteOneBase)) {
        crudOptions.routes.deleteOneBase = { returnDeleted: false, interceptors: [] };
    }
}
function getRoutesSlugName(crudOptions, path) {
    if (!shared_utils_1.isNil(crudOptions.params.id)) {
        return 'id';
    }
    return Object.keys(crudOptions.params).filter((slug) => !path.includes(`:${slug}`))[0] || 'id';
}
function getRoutesInterceptors(routeOptions) {
    return Array.isArray(routeOptions.interceptors) ? routeOptions.interceptors : [];
}
//# sourceMappingURL=crud.decorator.js.map
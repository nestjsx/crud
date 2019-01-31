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
const dto_1 = require("../dto");
const enums_1 = require("../enums");
const interceptors_1 = require("../interceptors");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const helpers_1 = require("./helpers");
exports.Crud = (dto, crudOptions = {}) => (target) => {
    const prototype = target.prototype;
    const baseRoutes = {
        getManyBase: {
            name: 'getManyBase',
            path: '/',
            method: common_1.RequestMethod.GET,
        },
        getOneBase: {
            name: 'getOneBase',
            path: '/:id',
            method: common_1.RequestMethod.GET,
        },
        createOneBase: {
            name: 'createOneBase',
            path: '/',
            method: common_1.RequestMethod.POST,
        },
        createManyBase: {
            name: 'createManyBase',
            path: '/bulk',
            method: common_1.RequestMethod.POST,
        },
        updateOneBase: {
            name: 'updateOneBase',
            path: '/:id',
            method: common_1.RequestMethod.PATCH,
        },
        deleteOneBase: {
            name: 'deleteOneBase',
            path: '/:id',
            method: common_1.RequestMethod.DELETE,
        },
    };
    getParamsFilterInit(prototype, crudOptions);
    getMergedOptionsInit(prototype, crudOptions);
    getManyBaseInit(target, baseRoutes.getManyBase.name, dto, crudOptions);
    getOneBaseInit(target, baseRoutes.getOneBase.name, dto, crudOptions);
    createOneBaseInit(target, baseRoutes.createOneBase.name, dto, crudOptions);
    createManyBaseInit(target, baseRoutes.createManyBase.name, dto, crudOptions);
    updateOneBaseInit(target, baseRoutes.updateOneBase.name, dto, crudOptions);
    deleteOneBaseInit(target, baseRoutes.deleteOneBase.name, crudOptions);
    Object.getOwnPropertyNames(prototype).forEach((name) => {
        const overrided = helpers_1.getOverrideMetadata(prototype[name]);
        const route = baseRoutes[overrided];
        if (overrided && route) {
            const interceptors = helpers_1.getInterceptors(prototype[name]) || [];
            const baseInterceptors = helpers_1.getInterceptors(prototype[overrided]) || [];
            const baseAction = helpers_1.getAction(prototype[overrided]);
            helpers_1.setInterceptors([...interceptors, ...baseInterceptors], prototype[name]);
            helpers_1.setAction(baseAction, prototype[name]);
            helpers_1.setRoute(route.path, route.method, prototype[name]);
            route.override = true;
        }
    });
    Object.keys(baseRoutes).forEach((name) => {
        const route = baseRoutes[name];
        if (!route.override) {
            helpers_1.setRoute(route.path, route.method, prototype[route.name]);
        }
    });
};
exports.Override = (name) => (target, key, descriptor) => {
    Reflect.defineMetadata(constants_1.OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
    return descriptor;
};
function getManyBaseInit(target, name, dto, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function getManyBase(params, query) {
        const mergedOptions = this.getMergedOptions(params);
        return this.service.getMany(query, mergedOptions);
    };
    helpers_1.setParams(Object.assign({}, helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.QUERY, 1)), target, name);
    helpers_1.setParamTypes([Object, dto_1.RestfulParamsDto], prototype, name);
    helpers_1.setInterceptors([interceptors_1.RestfulQueryInterceptor], prototype[name]);
    helpers_1.setAction(enums_1.CrudActions.ReadAll, prototype[name]);
    helpers_1.setSwaggerParams(prototype[name], crudOptions);
    helpers_1.setSwaggerQueryGetMany(prototype[name], dto.name);
}
function getOneBaseInit(target, name, dto, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function getOneBase(id, params, query) {
        const mergedOptions = this.getMergedOptions(params);
        return this.service.getOne(id, query, mergedOptions);
    };
    helpers_1.setParams(Object.assign({}, helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0, [], 'id'), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.QUERY, 2)), target, name);
    helpers_1.setParamTypes([Number, Object, dto_1.RestfulParamsDto], prototype, name);
    helpers_1.setInterceptors([interceptors_1.RestfulQueryInterceptor], prototype[name]);
    helpers_1.setAction(enums_1.CrudActions.ReadOne, prototype[name]);
    helpers_1.setSwaggerParams(prototype[name], crudOptions);
    helpers_1.setSwaggerQueryGetOne(prototype[name], dto.name);
}
function createOneBaseInit(target, name, dto, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function createOneBase(params, body) {
        const paramsFilter = this.getParamsFilter(params);
        return this.service.createOne(body, paramsFilter);
    };
    helpers_1.setParams(Object.assign({}, helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1, [
        helpers_1.setValidationPipe(crudOptions, enums_1.CrudValidate.CREATE),
    ])), target, name);
    helpers_1.setParamTypes([Object, dto], prototype, name);
    helpers_1.setAction(enums_1.CrudActions.CreateOne, prototype[name]);
    helpers_1.setSwaggerParams(prototype[name], crudOptions);
}
function createManyBaseInit(target, name, dto, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function createManyBase(params, body) {
        const paramsFilter = this.getParamsFilter(params);
        return this.service.createMany(body, paramsFilter);
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
    helpers_1.setParams(Object.assign({}, helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1, [
        helpers_1.setValidationPipe(crudOptions, enums_1.CrudValidate.CREATE),
    ])), target, name);
    helpers_1.setParamTypes([Object, utils_1.hasValidator ? BulkDto : {}], prototype, name);
    helpers_1.setAction(enums_1.CrudActions.CreateMany, prototype[name]);
    helpers_1.setSwaggerParams(prototype[name], crudOptions);
}
function updateOneBaseInit(target, name, dto, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function updateOneBase(id, params, body) {
        const paramsFilter = this.getParamsFilter(params);
        return this.service.updateOne(id, body, paramsFilter);
    };
    helpers_1.setParams(Object.assign({}, helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0, [], 'id'), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 2, [
        helpers_1.setValidationPipe(crudOptions, enums_1.CrudValidate.UPDATE),
    ])), target, name);
    helpers_1.setParamTypes([Number, Object, dto], prototype, name);
    helpers_1.setAction(enums_1.CrudActions.UpdateOne, prototype[name]);
    helpers_1.setSwaggerParams(prototype[name], crudOptions);
}
function deleteOneBaseInit(target, name, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function deleteOneBase(id, params) {
        const paramsFilter = this.getParamsFilter(params);
        return this.service.deleteOne(id, paramsFilter);
    };
    helpers_1.setParams(Object.assign({}, helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0, [], 'id'), helpers_1.createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1)), target, name);
    helpers_1.setParamTypes([Number, Object], prototype, name);
    helpers_1.setAction(enums_1.CrudActions.DeleteOne, prototype[name]);
    helpers_1.setSwaggerParams(prototype[name], crudOptions);
}
function getParamsFilterInit(prototype, crudOptions) {
    prototype['getParamsFilter'] = function getParamsFilter(params) {
        if (!crudOptions.params || !params) {
            return [];
        }
        const isArray = Array.isArray(crudOptions.params);
        return (isArray ? crudOptions.params : Object.keys(crudOptions.params))
            .filter((field) => !!params[field])
            .map((field) => ({
            field: isArray ? field : crudOptions.params[field],
            operator: 'eq',
            value: params[field],
        }));
    };
}
function getMergedOptionsInit(prototype, crudOptions) {
    prototype['getMergedOptions'] = function getMergedOptions(params) {
        const paramsFilter = this.getParamsFilter(params);
        const options = Object.assign({}, crudOptions.options || {});
        const optionsFilter = options.filter || [];
        const filter = [...optionsFilter, ...paramsFilter];
        if (filter.length) {
            options.filter = filter;
        }
        return options;
    };
}
//# sourceMappingURL=crud.decorator.js.map
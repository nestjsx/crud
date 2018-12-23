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
const constants_1 = require("@nestjs/common/constants");
const dto_1 = require("../dto");
const enums_1 = require("../enums");
const interceptors_1 = require("../interceptors");
const constants_2 = require("../constants");
const utils_1 = require("../utils");
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
    getParamsFilter(prototype);
    getMergedOptions(prototype);
    getManyBaseInit(target, baseRoutes.getManyBase.name);
    getOneBaseInit(target, baseRoutes.getOneBase.name);
    createOneBaseInit(target, baseRoutes.createOneBase.name, dto, crudOptions);
    createManyBaseInit(target, baseRoutes.createManyBase.name, dto, crudOptions);
    updateOneBaseInit(target, baseRoutes.updateOneBase.name, dto, crudOptions);
    deleteOneBaseInit(target, baseRoutes.deleteOneBase.name);
    Object.getOwnPropertyNames(prototype).forEach((name) => {
        const overrided = getOverrideMetadata(prototype[name]);
        const route = baseRoutes[overrided];
        if (overrided && route) {
            const interceptors = getInterceptors(prototype[name]) || [];
            const baseInterceptors = getInterceptors(prototype[overrided]) || [];
            const baseAction = getAction(prototype[overrided]);
            setInterceptors([...interceptors, ...baseInterceptors], prototype[name]);
            setAction(baseAction, prototype[name]);
            setRoute(route.path, route.method, prototype[name]);
            route.override = true;
        }
    });
    Object.keys(baseRoutes).forEach((name) => {
        const route = baseRoutes[name];
        if (!route.override) {
            setRoute(route.path, route.method, prototype[route.name]);
        }
    });
};
exports.Override = (name) => (target, key, descriptor) => {
    Reflect.defineMetadata(constants_2.OVERRIDE_METHOD_METADATA, name || `${key}Base`, target[key]);
    return descriptor;
};
function getManyBaseInit(target, name) {
    const prototype = target.prototype;
    prototype[name] = function getManyBase(params, query) {
        const mergedOptions = this.getMergedOptions(params);
        return this.service.getMany(query, mergedOptions);
    };
    setParams(Object.assign({}, createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.QUERY, 1)), target, name);
    setParamTypes([Object, dto_1.RestfulParamsDto], prototype, name);
    setInterceptors([interceptors_1.RestfulQueryInterceptor], prototype[name]);
    setAction(enums_1.CrudActions.ReadAll, prototype[name]);
}
function getOneBaseInit(target, name) {
    const prototype = target.prototype;
    prototype[name] = function getOneBase(id, params, query) {
        const mergedOptions = this.getMergedOptions(params);
        return this.service.getOne(id, query, mergedOptions);
    };
    setParams(Object.assign({}, createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0, [setParseIntPipe()], 'id'), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.QUERY, 2)), target, name);
    setParamTypes([Number, Object, dto_1.RestfulParamsDto], prototype, name);
    setInterceptors([interceptors_1.RestfulQueryInterceptor], prototype[name]);
    setAction(enums_1.CrudActions.ReadOne, prototype[name]);
}
function createOneBaseInit(target, name, dto, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function createOneBase(params, body) {
        const paramsFilter = this.getParamsFilter(params);
        return this.service.createOne(body, paramsFilter);
    };
    setParams(Object.assign({}, createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1, [
        setValidationPipe(crudOptions, enums_1.CrudValidate.CREATE),
    ])), target, name);
    setParamTypes([Object, dto], prototype, name);
    setAction(enums_1.CrudActions.CreateOne, prototype[name]);
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
    setParams(Object.assign({}, createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1, [
        setValidationPipe(crudOptions, enums_1.CrudValidate.CREATE),
    ])), target, name);
    setParamTypes([Object, utils_1.hasValidator ? BulkDto : {}], prototype, name);
    setAction(enums_1.CrudActions.CreateMany, prototype[name]);
}
function updateOneBaseInit(target, name, dto, crudOptions) {
    const prototype = target.prototype;
    prototype[name] = function updateOneBase(id, params, body) {
        const paramsFilter = this.getParamsFilter(params);
        return this.service.updateOne(id, body, paramsFilter);
    };
    setParams(Object.assign({}, createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0, [setParseIntPipe()], 'id'), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 2, [
        setValidationPipe(crudOptions, enums_1.CrudValidate.UPDATE),
    ])), target, name);
    setParamTypes([Number, Object, dto], prototype, name);
    setAction(enums_1.CrudActions.UpdateOne, prototype[name]);
}
function deleteOneBaseInit(target, name) {
    const prototype = target.prototype;
    prototype[name] = function deleteOneBase(id, params) {
        const paramsFilter = this.getParamsFilter(params);
        return this.service.deleteOne(id, paramsFilter);
    };
    setParams(Object.assign({}, createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0, [setParseIntPipe()], 'id'), createParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1)), target, name);
    setParamTypes([Number, Object], prototype, name);
    setAction(enums_1.CrudActions.DeleteOne, prototype[name]);
}
function getParamsFilter(prototype) {
    prototype['getParamsFilter'] = function (params) {
        if (!this.paramsFilter || !params) {
            return [];
        }
        const isArray = Array.isArray(this.paramsFilter);
        return (isArray ? this.paramsFilter : Object.keys(this.paramsFilter))
            .filter((field) => !!params[field])
            .map((field) => ({
            field: isArray ? field : this.paramsFilter[field],
            operator: 'eq',
            value: params[field],
        }));
    };
}
function getMergedOptions(prototype) {
    prototype['getMergedOptions'] = function (params) {
        const paramsFilter = this.getParamsFilter(params);
        const options = this.options || {};
        const optionsFilter = options.filter || [];
        const filter = [...optionsFilter, ...paramsFilter];
        if (filter.length) {
            options.filter = filter;
        }
        return options;
    };
}
function setRoute(path, method, func) {
    Reflect.defineMetadata(constants_1.PATH_METADATA, path, func);
    Reflect.defineMetadata(constants_1.METHOD_METADATA, method, func);
}
function setParamTypes(args, prototype, name) {
    Reflect.defineMetadata(constants_1.PARAMTYPES_METADATA, args, prototype, name);
}
function setParams(metadata, target, name) {
    Reflect.defineMetadata(constants_1.ROUTE_ARGS_METADATA, metadata, target, name);
}
function setInterceptors(interceptors, func) {
    Reflect.defineMetadata(constants_1.INTERCEPTORS_METADATA, interceptors, func);
}
function setAction(action, func) {
    Reflect.defineMetadata(constants_2.ACTION_NAME_METADATA, action, func);
}
function createParamMetadata(paramtype, index, pipes = [], data = undefined) {
    return {
        [`${paramtype}:${index}`]: {
            index,
            pipes,
            data,
        },
    };
}
function getOverrideMetadata(func) {
    return Reflect.getMetadata(constants_2.OVERRIDE_METHOD_METADATA, func);
}
function getInterceptors(func) {
    return Reflect.getMetadata(constants_1.INTERCEPTORS_METADATA, func);
}
function getAction(func) {
    return Reflect.getMetadata(constants_2.ACTION_NAME_METADATA, func);
}
function setValidationPipe(crudOptions = {}, group) {
    const options = crudOptions.validation || {};
    return utils_1.hasValidator
        ? new common_1.ValidationPipe(Object.assign({}, options, { groups: [group], transform: false }))
        : undefined;
}
function setParseIntPipe() {
    return utils_1.hasTypeorm ? new common_1.ParseIntPipe() : undefined;
}
//# sourceMappingURL=crud.decorator.js.map
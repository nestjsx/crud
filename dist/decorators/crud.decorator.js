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
exports.Crud = (dto) => (target) => {
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
    getOptions(prototype);
    getParamsFilter(prototype);
    getManyBase(target, baseRoutes.getManyBase.name);
    getOneBase(target, baseRoutes.getOneBase.name);
    createOneBase(target, baseRoutes.createOneBase.name, dto);
    createManyBase(target, baseRoutes.createManyBase.name, dto);
    updateOneBase(target, baseRoutes.updateOneBase.name, dto);
    deleteOneBase(target, baseRoutes.deleteOneBase.name);
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
function getManyBase(target, name) {
    const prototype = target.prototype;
    prototype[name] = function (query, params) {
        const filter = this.getParamsFilter(params);
        const options = this.getOptions();
        const merged = Object.assign({}, options, { filter: [...(options.filter ? options.filter : []), ...filter] });
        return this.service.getMany(query, merged);
    };
    setParams(Object.assign({}, getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.QUERY, 0), getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1)), target, name);
    setParamTypes([dto_1.RestfulParamsDto, Object], prototype, name);
    setInterceptors([interceptors_1.RestfulQueryInterceptor], prototype[name]);
    setAction(enums_1.CrudActions.ReadAll, prototype[name]);
}
function getOneBase(target, name) {
    const prototype = target.prototype;
    prototype[name] = function (params, query) {
        const filter = this.getParamsFilter(params);
        const options = this.getOptions();
        const merged = Object.assign({}, options, { filter: [...(options.filter ? options.filter : []), ...filter] });
        return this.service.getOne(params.id, query, merged);
    };
    setParams(Object.assign({}, getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.QUERY, 1)), target, name);
    setParamTypes([Object, dto_1.RestfulParamsDto], prototype, name);
    setInterceptors([interceptors_1.RestfulQueryInterceptor], prototype[name]);
    setAction(enums_1.CrudActions.ReadOne, prototype[name]);
}
function createOneBase(target, name, dto) {
    const prototype = target.prototype;
    prototype[name] = function (body, params) {
        const filter = this.getParamsFilter(params);
        return body;
    };
    setParams(Object.assign({}, getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 0), getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1)), target, name);
    setParamTypes([dto || Object, Object], prototype, name);
    setAction(enums_1.CrudActions.CreateOne, prototype[name]);
}
function createManyBase(target, name, dto) {
    const prototype = target.prototype;
    prototype[name] = function (body, params) {
        const filter = this.getParamsFilter(params);
        return body;
    };
    const isArray = utils_1.mockValidatorDecorator('isArray');
    const ValidateNested = utils_1.mockValidatorDecorator('ValidateNested');
    const Type = utils_1.mockTransformerDecorator('Type');
    class BulkDto {
    }
    __decorate([
        isArray(),
        ValidateNested({ each: true }),
        Type((t) => dto),
        __metadata("design:type", Array)
    ], BulkDto.prototype, "bulk", void 0);
    setParams(Object.assign({}, getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 0), getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 1)), target, name);
    setParamTypes([dto ? BulkDto : {}, Object], prototype, name);
    setAction(enums_1.CrudActions.CreateMany, prototype[name]);
}
function updateOneBase(target, name, dto) {
    const prototype = target.prototype;
    prototype[name] = function (params, body) {
        const filter = this.getParamsFilter(params);
        return body;
    };
    setParams(Object.assign({}, getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.BODY, 1)), target, name);
    setParamTypes([Object, dto || Object], prototype, name);
    setAction(enums_1.CrudActions.UpdateOne, prototype[name]);
}
function deleteOneBase(target, name) {
    const prototype = target.prototype;
    prototype[name] = function (params) {
        const filter = this.getParamsFilter(params);
        return 'deleted';
    };
    setParams(getParamMetadata(route_paramtypes_enum_1.RouteParamtypes.PARAM, 0), target, name);
    setParamTypes([Object], prototype, name);
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
function getOptions(prototype) {
    prototype['getOptions'] = function () {
        return this.options ? this.options : {};
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
function getParamMetadata(paramtype, index) {
    return {
        [`${paramtype}:${index}`]: {
            index,
            pipes: [],
            data: undefined,
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
//# sourceMappingURL=crud.decorator.js.map
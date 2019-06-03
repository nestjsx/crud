"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_paramtypes_enum_1 = require("@nestjs/common/enums/route-paramtypes.enum");
const constants_1 = require("@nestjs/common/constants");
const constants_2 = require("../constants");
class R {
    static set(metadataKey, metadataValue, target, propertyKey = undefined) {
        if (propertyKey) {
            Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        else {
            Reflect.defineMetadata(metadataKey, metadataValue, target);
        }
    }
    static get(metadataKey, target, propertyKey = undefined) {
        return propertyKey
            ? Reflect.getMetadata(metadataKey, target, propertyKey)
            : Reflect.getMetadata(metadataKey, target);
    }
    static createCustomRouteArg(paramtype, index, pipes = [], data = undefined) {
        return {
            [`${paramtype}${constants_1.CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
                index,
                factory: (_, req) => req[paramtype],
                data,
                pipes,
            },
        };
    }
    static createRouteArg(paramtype, index, pipes = [], data = undefined) {
        return {
            [`${paramtype}:${index}`]: {
                index,
                pipes,
                data,
            },
        };
    }
    static setDecorators(decorators, target, name) {
        Reflect.defineProperty(target, name, Reflect.decorate(decorators, target, name, Reflect.getOwnPropertyDescriptor(target, name)));
        Reflect.decorate(decorators, target, name, Reflect.getOwnPropertyDescriptor(target, name));
    }
    static setParsedRequestArg(index) {
        return R.createCustomRouteArg(constants_2.PARSED_CRUD_REQUEST_KEY, index);
    }
    static setBodyArg(index, pipes = []) {
        return R.createRouteArg(route_paramtypes_enum_1.RouteParamtypes.BODY, index, pipes);
    }
    static setCrudOptions(options, target) {
        R.set(constants_2.CRUD_OPTIONS_METADATA, options, target);
    }
    static setRoute(route, func) {
        R.set(constants_1.PATH_METADATA, route.path, func);
        R.set(constants_1.METHOD_METADATA, route.method, func);
    }
    static setInterceptors(interceptors, func) {
        R.set(constants_1.INTERCEPTORS_METADATA, interceptors, func);
    }
    static setRouteArgs(metadata, target, name) {
        R.set(constants_1.ROUTE_ARGS_METADATA, metadata, target, name);
    }
    static setRouteArgsTypes(metadata, target, name) {
        R.set(constants_1.PARAMTYPES_METADATA, metadata, target, name);
    }
    static setAction(action, func) {
        R.set(constants_2.ACTION_NAME_METADATA, action, func);
    }
    static getCrudOptions(target) {
        return R.get(constants_2.CRUD_OPTIONS_METADATA, target);
    }
    static getAction(func) {
        return R.get(constants_2.ACTION_NAME_METADATA, func);
    }
    static getOverrideRoute(func) {
        return R.get(constants_2.OVERRIDE_METHOD_METADATA, func);
    }
    static getInterceptors(func) {
        return R.get(constants_1.INTERCEPTORS_METADATA, func) || [];
    }
    static getRouteArgs(target, name) {
        return R.get(constants_1.ROUTE_ARGS_METADATA, target, name);
    }
    static getRouteArgsTypes(target, name) {
        return R.get(constants_1.PARAMTYPES_METADATA, target, name) || [];
    }
    static getParsedBody(func) {
        return R.get(constants_2.PARSED_BODY_METADATA, func);
    }
}
exports.R = R;
//# sourceMappingURL=reflection.helper.js.map
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { BaseRoute, CrudOptions } from '../interfaces';
import { BaseRouteName } from '../types';
import { CrudActions } from '../enums';
export declare class R {
    static set(metadataKey: any, metadataValue: any, target: Object, propertyKey?: string | symbol): void;
    static get<T extends any>(metadataKey: any, target: Object, propertyKey?: string | symbol): T;
    static createCustomRouteArg(paramtype: string, index: number, pipes?: any[], data?: any): any;
    static createRouteArg(paramtype: RouteParamtypes, index: number, pipes?: any[], data?: any): any;
    static setDecorators(decorators: (PropertyDecorator | MethodDecorator)[], target: object, name: string): void;
    static setParsedRequestArg(index: number): any;
    static setBodyArg(index: number, pipes?: any[]): any;
    static setCrudOptions(options: CrudOptions, target: any): void;
    static setRoute(route: BaseRoute, func: Function): void;
    static setInterceptors(interceptors: any[], func: Function): void;
    static setRouteArgs(metadata: any, target: any, name: string): void;
    static setRouteArgsTypes(metadata: any, target: any, name: string): void;
    static setAction(action: CrudActions, func: Function): void;
    static getCrudOptions(target: any): CrudOptions;
    static getAction(func: Function): CrudActions;
    static getOverrideRoute(func: Function): BaseRouteName;
    static getInterceptors(func: Function): any[];
    static getRouteArgs(target: any, name: string): any;
    static getRouteArgsTypes(target: any, name: string): any[];
    static getParsedBody(func: Function): any;
}

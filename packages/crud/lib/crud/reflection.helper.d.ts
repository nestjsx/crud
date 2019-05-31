import { BaseRoute, CrudOptions } from '../interfaces';
import { CrudActions } from '../enums';
export declare class R {
    static set(metadataKey: any, metadataValue: any, target: Object, propertyKey?: string | symbol): void;
    static setCustomRouteDecorator(paramtype: string, index: number, pipes?: any[], data?: any): any;
    static setParsedRequest(index: number): any;
    static get<T extends any>(metadataKey: any, target: Object, propertyKey?: string | symbol): T;
    static setCrudOptions(options: CrudOptions, target: any): void;
    static setRoute(route: BaseRoute, func: Function): void;
    static setInterceptors(interceptors: any[], func: Function): void;
    static setRouteArgs(metadata: any, target: any, name: string): void;
    static setAction(action: CrudActions, func: Function): void;
    static getCrudOptions(target: any): CrudOptions;
    static getAction(func: Function): CrudActions;
}

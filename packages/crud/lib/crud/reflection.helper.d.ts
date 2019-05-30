import { BaseRoute, CrudOptions } from '../interfaces';
export declare class R {
    static set(metadataKey: any, metadataValue: any, target: Object): void;
    static get<T extends any>(metadataKey: any, target: Object): T;
    static setCrudOptions(options: CrudOptions, target: any): void;
    static setRoute(route: BaseRoute, func: Function): void;
    static setInterceptors(interceptors: any[], func: Function): void;
    static getCrudOptions(target: any): CrudOptions;
}

import { MergedCrudOptions, ParamsOptions } from '../interfaces';
import { BaseRouteName } from '../types';
export declare const swagger: any;
export declare const swaggerConst: any;
export declare const swaggerPkgJson: any;
export declare class Swagger {
    static operationsMap(modelName: any): {
        [key in BaseRouteName]: string;
    };
    static setOperation(metadata: any, func: Function): void;
    static setParams(metadata: any, func: Function): void;
    static setExtraModels(swaggerModels: any): void;
    static setResponseOk(metadata: any, func: Function): void;
    static getOperation(func: Function): any;
    static getParams(func: Function): any[];
    static getExtraModels(target: any): any[];
    static getResponseOk(func: Function): any;
    static createResponseMeta(name: BaseRouteName, options: MergedCrudOptions, swaggerModels: any): any;
    static createPathParamsMeta(options: ParamsOptions): any[];
    static createQueryParamsMeta(name: BaseRouteName, options: MergedCrudOptions): ({
        type: string;
        name: any;
        description: string;
        required: boolean;
        in: string;
    } | {
        schema: {
            type: string;
        };
        name: any;
        description: string;
        required: boolean;
        in: string;
    })[];
    static getQueryParamsNames(): {
        delim: string;
        delimStr: string;
        fields: any;
        search: any;
        filter: any;
        or: any;
        join: any;
        sort: any;
        limit: any;
        offset: any;
        page: any;
        cache: any;
        includeDeleted: any;
    };
    private static getSwaggerVersion;
}
export declare function ApiProperty(options?: any): PropertyDecorator;

import { HttpStatus } from '@nestjs/common';
import { ParamsOptions } from '../interfaces';
import { BaseRouteName } from '../types';
export declare const swaggerPkg: any;
export declare class Swagger {
    static operationsMap(modelName: any): {
        [key in BaseRouteName]: string;
    };
    static setOperation(name: BaseRouteName, modelName: string, func: Function): void;
    static setParams(metadata: any, func: Function): void;
    static setResponseOk(metadata: any, func: Function): void;
    static getOperation(func: Function): any;
    static getParams(func: Function): any[];
    static getResponseOk(func: Function): any;
    static createReponseOkMeta(status: HttpStatus, isArray: boolean, dto: any): any;
    static createPathParasmMeta(options: ParamsOptions): any[];
    static createQueryParamsMeta(name: BaseRouteName): ({
        name: any;
        description: string;
        required: boolean;
        in: string;
        type: StringConstructor;
    } | {
        name: any;
        description: string;
        required: boolean;
        in: string;
        type: NumberConstructor;
    })[];
    static getQueryParamsNames(): {
        delim: string;
        delimStr: string;
        fields: any;
        filter: any;
        or: any;
        join: any;
        sort: any;
        limit: any;
        offset: any;
        page: any;
        cache: any;
    };
}

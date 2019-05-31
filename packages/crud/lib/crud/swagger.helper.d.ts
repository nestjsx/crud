import { ParamsOptions } from '../interfaces';
import { BaseRouteName } from '../types';
export declare const swaggerPkg: any;
export declare class Swagger {
    static operationsMap(modelName: any): {
        [key in BaseRouteName]: string;
    };
    static setOperation(name: BaseRouteName, modelName: string, func: Function): void;
    static setParams(metadata: any, func: Function): void;
    static getOperation(func: Function): any;
    static getParams(func: Function): any[];
    static createPathParamMeta(options: ParamsOptions): any;
}

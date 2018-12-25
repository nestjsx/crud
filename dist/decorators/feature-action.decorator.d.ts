import { Type } from '@nestjs/common';
export declare const Feature: (name: string) => (target: object, key?: any, descriptor?: any) => any;
export declare const Action: (name: string) => (target: object, key?: any, descriptor?: any) => any;
export declare const getFeature: <T = any>(target: Type<T>) => any;
export declare const getAction: (target: Function) => any;

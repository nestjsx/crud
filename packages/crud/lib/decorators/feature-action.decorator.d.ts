import { Type } from '@nestjs/common';
export declare const Feature: (name: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const Action: (name: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const getFeature: <T = any>(target: Type<T>) => any;
export declare const getAction: (target: Function) => any;

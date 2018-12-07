import 'reflect-metadata';
import { RequestMethod } from '@nestjs/common';
export declare const Route: (method?: RequestMethod, path?: string) => (target: any, key: any, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const Inherit: () => (target: object) => void;
export declare const Override: () => (target: any, key: any, descriptor: PropertyDescriptor) => PropertyDescriptor;

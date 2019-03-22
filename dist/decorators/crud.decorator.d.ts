import { CrudOptions } from '../interfaces';
import { BaseRouteName } from '../types';
export declare const Crud: (dto: any, crudOptions?: CrudOptions) => (target: object) => void;
export declare const Override: (name?: BaseRouteName) => (target: any, key: any, descriptor: PropertyDescriptor) => PropertyDescriptor;

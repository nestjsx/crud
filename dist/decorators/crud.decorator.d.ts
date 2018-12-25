import { CrudOptions } from '../interfaces';
declare type BaseRouteName = 'getManyBase' | 'getOneBase' | 'createOneBase' | 'createManyBase' | 'updateOneBase' | 'deleteOneBase';
export declare const Crud: (dto: any, crudOptions?: CrudOptions) => (target: object) => void;
export declare const Override: (name?: BaseRouteName) => (target: any, key: any, descriptor: PropertyDescriptor) => PropertyDescriptor;
export {};

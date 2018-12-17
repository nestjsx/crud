import { ValidationPipeOptions } from '@nestjs/common';
interface CrudOptions {
    validation?: ValidationPipeOptions;
}
export declare const Crud: (dto: any, crudOptions?: CrudOptions) => (target: object) => void;
export declare const Override: (name?: "getManyBase" | "getOneBase" | "createOneBase" | "updateOneBase" | "deleteOneBase") => (target: any, key: any, descriptor: PropertyDescriptor) => PropertyDescriptor;
export {};

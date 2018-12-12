export declare const Crud: (dto?: any) => (target: object) => void;
export declare const Override: (name?: "getManyBase" | "getOneBase" | "createOneBase" | "updateOneBase" | "deleteOneBase") => (target: any, key: any, descriptor: PropertyDescriptor) => PropertyDescriptor;

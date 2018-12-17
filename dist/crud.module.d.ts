import { Type } from '@nestjs/common';
export declare class CrudModule {
    static forFeature(path: string, service: Function, entity: Function, dto?: any): Type<any>;
}

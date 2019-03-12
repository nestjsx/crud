import { DynamicModule } from '@nestjs/common';
import { CrudModuleConfig } from '../interfaces';
export declare class CrudModule {
    static loadConfig(config?: CrudModuleConfig): void;
    static forRoot(): DynamicModule;
}

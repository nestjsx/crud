import { Module, Global, DynamicModule } from '@nestjs/common';

import { CrudModuleConfig } from '../interfaces';
import { CrudConfigService } from './crud-config.service';

@Global()
@Module({})
export class CrudModule {
  static loadConfig(config: CrudModuleConfig = {}) {
    CrudConfigService.load(config);
  }

  static forRoot(): DynamicModule {
    return {
      module: CrudModule,
    };
  }
}

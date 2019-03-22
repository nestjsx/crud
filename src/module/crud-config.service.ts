import { CrudModuleConfig } from '../interfaces';

export class CrudConfigService {
  static config: CrudModuleConfig = {};

  static load(config: CrudModuleConfig) {
    CrudConfigService.config = config;
  }
}

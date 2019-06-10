import { CrudGlobalConfig } from '../interfaces';
export declare class CrudConfigService {
    static config: CrudGlobalConfig;
    static load(config?: CrudGlobalConfig): void;
}

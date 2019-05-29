import { CrudOptions } from '../interfaces';
export declare class CrudOptionsService {
    private _options;
    private static options;
    constructor(_options: CrudOptions);
    static setOptions(options: CrudOptions): void;
    static getOptions(): CrudOptions;
}

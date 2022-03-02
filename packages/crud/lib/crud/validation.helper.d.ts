import { ValidationPipe } from '@nestjs/common';
import { CrudValidationGroups } from '../enums';
import { CrudOptions, MergedCrudOptions } from '../interfaces';
export declare class Validation {
    static getValidationPipe(options: CrudOptions, group?: CrudValidationGroups): ValidationPipe;
    static createBulkDto<T = any>(options: MergedCrudOptions): any;
}

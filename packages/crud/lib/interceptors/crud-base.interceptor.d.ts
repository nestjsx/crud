import { ExecutionContext } from '@nestjs/common';
import { CrudActions } from '../enums';
import { MergedCrudOptions } from '../interfaces';
export declare class CrudBaseInterceptor {
    protected getCrudInfo(context: ExecutionContext): {
        ctrlOptions: MergedCrudOptions;
        crudOptions: Partial<MergedCrudOptions>;
        action: CrudActions;
    };
}

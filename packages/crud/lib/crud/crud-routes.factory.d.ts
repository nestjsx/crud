import { CrudOptions } from '../interfaces';
export declare class CrudRoutesFactory {
    private target;
    private options;
    constructor(target: any, options: CrudOptions);
    static create(target: any, options: CrudOptions): CrudRoutesFactory;
    private readonly targetProto;
    private readonly modelName;
    private readonly actionsMap;
    private create;
    private setOptionsDefaults;
    private getRoutesSchema;
    private getManyBase;
    private getOneBase;
    private createOneBase;
    private createManyBase;
    private updateOneBase;
    private deleteOneBase;
    private canCreateRoute;
    private createRoutes;
    private overrideRoutes;
    private enableRoutes;
    private getPrimaryParam;
    private setArgs;
    private setInterceptors;
    private setAction;
    private setSwaggerOperation;
    private setSwaggerParams;
}

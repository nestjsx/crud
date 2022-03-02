import { RequestQueryBuilderOptions } from '@nestjsx/crud-request';
import { RoutesOptions } from './routes-options.interface';
import { ParamsOptions } from './params-options.interface';
import { AuthGlobalOptions } from './auth-options.interface';
export interface CrudGlobalConfig {
    queryParser?: RequestQueryBuilderOptions;
    auth?: AuthGlobalOptions;
    routes?: RoutesOptions;
    params?: ParamsOptions;
    query?: {
        limit?: number;
        maxLimit?: number;
        cache?: number | false;
        alwaysPaginate?: boolean;
        softDelete?: boolean;
    };
    serialize?: {
        getMany?: false;
        get?: false;
        create?: false;
        createMany?: false;
        update?: false;
        replace?: false;
        delete?: false;
        recover?: false;
    };
}

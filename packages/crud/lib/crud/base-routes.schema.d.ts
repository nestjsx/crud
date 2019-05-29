import { BaseRoute, RoutesOptions } from '../interfaces';
import { BaseRouteName } from '../types';
export declare function getBaseRoutesSchema(): BaseRoute[];
export declare function isRouteEnabled(name: BaseRouteName, options: RoutesOptions): boolean;

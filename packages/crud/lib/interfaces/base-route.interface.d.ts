import { RequestMethod } from '@nestjs/common';
import { BaseRouteName } from '../types';
export interface BaseRoute {
    name: BaseRouteName;
    path: string;
    method: RequestMethod;
    enable: boolean;
    override: boolean;
}

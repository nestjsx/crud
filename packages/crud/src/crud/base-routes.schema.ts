import { RequestMethod } from '@nestjs/common';
import { isArrayFull } from '@nestjsx/util';

import { BaseRoute, RoutesOptions } from '../interfaces';
import { BaseRouteName } from '../types';

export function getBaseRoutesSchema(): BaseRoute[] {
  return [
    {
      name: 'getManyBase',
      path: '/',
      method: RequestMethod.GET,
      enable: false,
      override: false,
    },
    {
      name: 'getOneBase',
      path: '',
      method: RequestMethod.GET,
      enable: false,
      override: false,
    },
    {
      name: 'createOneBase',
      path: '/',
      method: RequestMethod.POST,
      enable: false,
      override: false,
    },
    {
      name: 'createManyBase',
      path: '/bulk',
      method: RequestMethod.POST,
      enable: false,
      override: false,
    },
    {
      name: 'updateOneBase',
      path: '',
      method: RequestMethod.PATCH,
      enable: false,
      override: false,
    },
    {
      name: 'deleteOneBase',
      path: '',
      method: RequestMethod.DELETE,
      enable: false,
      override: false,
    },
  ];
}

export function isRouteEnabled(name: BaseRouteName, options: RoutesOptions): boolean {
  if (isArrayFull(options.only)) {
    return options.only.some((route) => route === name);
  }

  if (isArrayFull(options.exclude)) {
    return !options.exclude.some((route) => route === name);
  }

  return true;
}

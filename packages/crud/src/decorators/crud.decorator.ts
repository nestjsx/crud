import {} from '@nestjsx/util';

import { getBaseRoutesSchema, isRouteEnabled, setOptionsDefaults } from '../crud';
import { CrudOptions } from '../interfaces';

export const Crud = (options: CrudOptions = {}) => (
  target: Object,
  options: CrudOptions,
) => {
  const prototype = (target as any).prototype;
  const baseRoutes = getBaseRoutesSchema();
  // TODO: path
  // set crud options defaults
  setOptionsDefaults(options, target);

  baseRoutes.forEach((route) => {
    if (isRouteEnabled(route.name, options.routes)) {
    }
  });
};

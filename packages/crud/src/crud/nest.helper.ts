import {
  CUSTOM_ROUTE_AGRS_METADATA,
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';

import { PARSED_CRUD_REQUEST_KEY } from '../constants';

export class N {
  static setCustomRouteDecorator(
    paramtype: string,
    index: number,
    pipes: any[] = [],
    data = undefined,
  ): any {
    return {
      [`${paramtype}${CUSTOM_ROUTE_AGRS_METADATA}:${index}`]: {
        index,
        factory: (_, req) => req[paramtype],
        data,
        pipes,
      },
    };
  }

  static setParsedRequest(index: number) {
    return N.setCustomRouteDecorator(PARSED_CRUD_REQUEST_KEY, index)
  }
}

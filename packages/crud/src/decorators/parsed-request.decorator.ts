import { createParamDecorator } from '@nestjs/common';

import { PARSED_CRUD_REQUEST_KEY } from '../constants';

export const ParsedRequest = createParamDecorator(
  (_, req): ParameterDecorator => {
    return req[PARSED_CRUD_REQUEST_KEY];
  },
);

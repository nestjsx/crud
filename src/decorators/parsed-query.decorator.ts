import { createParamDecorator } from '@nestjs/common';

import { PARSED_QUERY_REQUEST_KEY } from '../constants';

export const ParsedQuery = createParamDecorator(
  (data, req): ParameterDecorator => {
    return req[PARSED_QUERY_REQUEST_KEY];
  },
);

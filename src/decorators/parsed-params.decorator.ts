import { createParamDecorator } from '@nestjs/common';

import { PARSED_PARAMS_REQUEST_KEY } from '../constants';

export const ParsedParams = createParamDecorator(
  (data, req): ParameterDecorator => {
    return req[PARSED_PARAMS_REQUEST_KEY];
  },
);

import { createParamDecorator } from '@nestjs/common';

import { PARSED_OPTIONS_METADATA } from '../constants';

export const ParsedOptions = createParamDecorator(
  (data, req): ParameterDecorator => {
    return req[PARSED_OPTIONS_METADATA];
  },
);

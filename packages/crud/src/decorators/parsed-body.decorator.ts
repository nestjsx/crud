import { PARSED_BODY_METADATA } from '../constants';

export const ParsedBody = () => (target, key, index) => {
  Reflect.defineMetadata(PARSED_BODY_METADATA, { index }, target[key]);
};

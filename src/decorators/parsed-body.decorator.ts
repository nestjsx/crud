import { setParsedBody } from './helpers';

export function ParsedBody() {
  return (target, key, index) => {
    setParsedBody({ index }, target[key]);
  };
}

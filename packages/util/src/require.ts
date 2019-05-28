import { oO } from '@zmotivat0r/o0';

export const requireSafe = async <T extends any, E extends any>(
  path: string,
  err?: E,
): Promise<[E, T]> => oO<T, E>((async () => require(path))(), { err });

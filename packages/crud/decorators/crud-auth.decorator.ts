import { R } from '../crud/reflection.helper';
import { AuthOptions } from '../interfaces';

export const CrudAuth =
  (options: AuthOptions) =>
  (target: unknown): void => {
    R.setCrudAuthOptions(options, target);
  };

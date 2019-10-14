import { R } from '../crud/reflection.helper';
import { AuthOptions } from '../interfaces';

export const CrudAuth = (options: AuthOptions) => (target: Object) => {
  R.setCrudAuthOptions(options, target);
};

import { CrudRoutesFactory } from '../crud';
import { CrudOptions } from '../interfaces';

export const Crud = (options: CrudOptions) => (target: Object) => {
  const factoryMethod = options.routesFactory || CrudRoutesFactory;
  let factory = new factoryMethod(target, options);
  factory = undefined;
};

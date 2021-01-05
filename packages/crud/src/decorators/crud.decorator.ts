import { CrudRoutesFactory } from '../crud';
import { CrudOptions } from '../interfaces';

export const Crud = (options: CrudOptions) => (target: Object) => {
  let FactoryClass = options.factory || CrudRoutesFactory;
  let factory = FactoryClass.create(target, options);
  factory = undefined;
};

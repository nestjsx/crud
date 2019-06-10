import { CrudRoutesFactory } from '../crud';
import { CrudOptions } from '../interfaces';

export const Crud = (options: CrudOptions) => (target: Object) => {
  let factory = CrudRoutesFactory.create(target, options);
  factory = undefined;
};

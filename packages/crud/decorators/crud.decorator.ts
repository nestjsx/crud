import { CrudRoutesFactory } from '../crud';
import { CrudOptions } from '../interfaces';

export const Crud =
  (options: CrudOptions) =>
  (target: unknown): void => {
    const factoryMethod = options.routesFactory || CrudRoutesFactory;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const factory = new factoryMethod(target, options);
  };

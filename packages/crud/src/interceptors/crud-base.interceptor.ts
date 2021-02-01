import { ExecutionContext } from '@nestjs/common';
import { R } from '../crud/reflection.helper';
import { CrudActions } from '../enums';
import { MergedCrudOptions } from '../interfaces';

export class CrudBaseInterceptor {
  protected getCrudInfo(
    context: ExecutionContext,
  ): {
    ctrlOptions: MergedCrudOptions;
    crudOptions: Partial<MergedCrudOptions>;
    action: CrudActions;
  } {
    const ctrl = context.getClass();
    const handler = context.getHandler();
    const ctrlOptions = R.getCrudOptions(ctrl);
    const methodOptions = R.getCrudOptions(handler);
    const { query: methodQuery, params: methodParams } = { ...methodOptions };
    const { query: ctrlQuery, params: ctrlParams, ...ctrlOthers } = { ...ctrlOptions };
    const query = { ...ctrlQuery, ...methodQuery };
    const params = { ...ctrlParams, ...methodParams };
    const crudOptions = { query, params, routes: {}, ...ctrlOthers };
    const action = R.getAction(handler);

    return { ctrlOptions, crudOptions, action };
  }
}

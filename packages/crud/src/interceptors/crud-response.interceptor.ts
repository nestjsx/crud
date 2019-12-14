import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isObject, isFunction } from '@nestjsx/util';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrudActions } from '../enums';
import { CrudBaseInterceptor } from './crud-base.interceptor';

@Injectable()
export class CrudResponseInterceptor extends CrudBaseInterceptor
  implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.setResponse(context, data)));
  }

  protected setResponse(context: ExecutionContext, data: any): any {
    const { crudOptions, action } = this.getCrudInfo(context);
    const { serialize } = crudOptions;
    const isAction = (a: CrudActions): boolean => action === a;
    const transformSimple = (dto: any) => plainToClass(dto, data);

    // getAll
    // createMany

    if (isAction(CrudActions.ReadOne) && isFunction(serialize.get)) {
      return transformSimple(serialize.get);
    }

    if (isAction(CrudActions.CreateOne) && isFunction(serialize.create)) {
      return transformSimple(serialize.create);
    }

    if (isAction(CrudActions.UpdateOne) && isFunction(serialize.update)) {
      return transformSimple(serialize.update);
    }

    if (isAction(CrudActions.ReplaceOne) && isFunction(serialize.replace)) {
      return transformSimple(serialize.replace);
    }

    if (isAction(CrudActions.DeleteOne) && isFunction(serialize.delete)) {
      return transformSimple(serialize.delete);
    }

    return data;
  }
}

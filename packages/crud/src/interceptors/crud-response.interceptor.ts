import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { classToPlain, classToPlainFromExist } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrudActions } from '../enums';
import { SerializeOptions } from '../interfaces';
import { CrudBaseInterceptor } from './crud-base.interceptor';

const actionToDtoNameMap: {
  [key in keyof typeof CrudActions]: keyof SerializeOptions;
} = {
  ReadAll: 'getMany',
  ReadOne: 'get',
  CreateMany: 'create',
  CreateOne: 'create',
  UpdateOne: 'update',
  ReplaceOne: 'replace',
  DeleteAll: 'delete',
  DeleteOne: 'delete',
};

@Injectable()
export class CrudResponseInterceptor extends CrudBaseInterceptor
  implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.serialize(context, data)));
  }

  protected transform(dto: any, data: any) {
    return dto && data && data.constructor !== Object
      ? data instanceof dto
        ? classToPlain(data)
        : classToPlainFromExist(data, new dto())
      : data;
  }

  protected serialize(context: ExecutionContext, data: any): any {
    const { crudOptions, action } = this.getCrudInfo(context);
    const { serialize } = crudOptions;
    const dto = serialize[actionToDtoNameMap[action]];
    const isArray = Array.isArray(data);

    switch (action) {
      case CrudActions.ReadAll:
        return isArray
          ? (data as any[]).map((item) => this.transform(serialize.get, item))
          : this.transform(dto, data);
      case CrudActions.CreateMany:
        return isArray
          ? (data as any[]).map((item) => this.transform(dto, item))
          : this.transform(dto, data);
      default:
        return this.transform(dto, data);
    }
  }
}

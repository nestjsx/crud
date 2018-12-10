import { Param, RequestMethod } from '@nestjs/common';

import {
  RestfulQuery,
  Route,
  ReadAll,
  ReadOne,
  CreateOne,
  CreateMany,
  UpdateOne,
  DeleteOne,
} from '../decorators';
import { RequestParamsParsed, FilterParamParsed } from '../interfaces';
import { ObjectLiteral } from '../interfaces/object-literal.interface';
import { RestfulService } from './restful-service.class';

export class CrudController<S extends RestfulService<T>, T> {
  protected paramsFilter: string[] | ObjectLiteral;

  constructor(protected service: S) {}

  @Route(RequestMethod.GET)
  @ReadAll()
  async getMany(@RestfulQuery() query: RequestParamsParsed, @Param() params?: ObjectLiteral) {
    const filter = this.getParamsFilter(params);
    return this.service.getMany(query, { filter });
  }

  @Route(RequestMethod.GET, ':id')
  @ReadOne()
  async getOne(@Param() params, @RestfulQuery() query: RequestParamsParsed) {
    const filter = this.getParamsFilter(params);

    return this.service.getOne(params.id, query, { filter });
  }

  @Route(RequestMethod.POST)
  @CreateOne()
  async createOne() {}

  @Route(RequestMethod.POST, 'bulk')
  @CreateMany()
  async createMany() {}

  @Route(RequestMethod.PATCH, ':id')
  @UpdateOne()
  async updateOne() {}

  @Route(RequestMethod.DELETE, ':id')
  @DeleteOne()
  async deleteOne() {}

  private getParamsFilter(params: ObjectLiteral): FilterParamParsed[] {
    if (!this.paramsFilter || !params) {
      return [];
    }

    const isArray = Array.isArray(this.paramsFilter);

    return (isArray ? this.paramsFilter : Object.keys(this.paramsFilter))
      .filter((field) => !!params[field])
      .map(
        (field) =>
          ({
            field: isArray ? field : this.paramsFilter[field],
            operator: 'eq',
            value: params[field],
          } as FilterParamParsed),
      );
  }
}

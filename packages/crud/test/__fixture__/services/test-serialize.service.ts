import { Injectable, Type } from '@nestjs/common';

import {
  CreateManyDto,
  CrudRequest,
  GetManyDefaultResponse,
} from '../../../src/interfaces';
import { CrudService } from '../../../src/services';
import { TestSerializeModel } from '../models';

@Injectable()
export class TestSerializeService<T = TestSerializeModel> extends CrudService<T> {
  private store: T[] = [];

  constructor(private Model: Type<T>) {
    super();
    this.store = [
      new this.Model({ id: 1, name: 'name', email: 'email1', isActive: true }),
      new this.Model({ id: 2, name: 'name2', email: 'email2', isActive: false }),
      new this.Model({ id: 3, name: 'name3', email: 'email3', isActive: true }),
      new this.Model({ id: 4, name: 'name4', email: 'email4', isActive: false }),
      new this.Model({ id: 5, name: 'name5', email: 'email5', isActive: true }),
    ];
  }

  async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const total = this.store.length;
    const limit = this.getTake(req.parsed, req.options.query);
    const offset = this.getSkip(req.parsed, limit);

    return this.decidePagination(req.parsed, req.options)
      ? this.createPageInfo(this.store, total, limit || total, offset || 0)
      : this.store;
  }
  async getOne(req: CrudRequest): Promise<T> {
    return this.store[0];
  }
  async createOne(req: CrudRequest, dto: T): Promise<any> {}
  async createMany(req: CrudRequest, dto: CreateManyDto<T>): Promise<any> {}
  async updateOne(req: CrudRequest, dto: T): Promise<any> {}
  async replaceOne(req: CrudRequest, dto: T): Promise<any> {}

  async deleteOne(req: CrudRequest): Promise<any> {
    return req.options.routes.deleteOneBase.returnDeleted ? this.store[0] : undefined;
  }

  async recoverOne(req: CrudRequest): Promise<any> {
    return req.options.routes.recoverOneBase.returnRecovered ? this.store[0] : undefined;
  }
}

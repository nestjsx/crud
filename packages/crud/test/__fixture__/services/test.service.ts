import { Injectable } from '@nestjs/common';
import { ParsedRequestParams } from '@rewiko/crud-request';
import { CrudRequestOptions } from '../../../src/interfaces';

import { CreateManyDto, CrudRequest } from '../../../src/interfaces';
import { CrudService } from '../../../src/services';

@Injectable()
export class TestService<T> extends CrudService<T> {
  async getMany(req: CrudRequest): Promise<any> {
    return { req };
  }
  async getOne(req: CrudRequest): Promise<any> {
    return { req };
  }
  async createOne(req: CrudRequest, dto: T): Promise<any> {
    return { req, dto };
  }
  async createMany(req: CrudRequest, dto: CreateManyDto<T>): Promise<any> {
    return { req, dto };
  }
  async updateOne(req: CrudRequest, dto: T): Promise<any> {
    return { req, dto };
  }
  async replaceOne(req: CrudRequest, dto: T): Promise<any> {
    return { req, dto };
  }
  async deleteOne(req: CrudRequest): Promise<any> {
    return { req };
  }
  async recoverOne(req: CrudRequest): Promise<any> {
    return { req };
  }
  decidePagination(parsed: ParsedRequestParams, options: CrudRequestOptions): boolean {
    return true;
  }
}

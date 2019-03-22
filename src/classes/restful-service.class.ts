import { BadRequestException, NotFoundException } from '@nestjs/common';

import { GetManyDefaultResponse, RequestParamsParsed, RestfulOptions } from '../interfaces';

export abstract class RestfulService<T> {
  protected abstract options: RestfulOptions;

  constructor() {
  }

  /**
   * Wrap page into page-info
   * override this method to create custom page-info response
   * @param data
   * @param total
   * @param limit
   * @param offset
   */
  public createPageInfo(data: T[], total: number, limit: number, offset: number): GetManyDefaultResponse<T> {
    return {
      data,
      count: data.length,
      total,
      page: Math.floor(offset / limit) + 1,
      pageCount: limit && total ? Math.round(total / limit) : undefined,
    };
  }

  abstract decidePagination(query: RequestParamsParsed, mergedOptions: RestfulOptions);

  abstract getMany(...args: any[]): Promise<GetManyDefaultResponse<T> | T[]>;

  abstract getOne(...args: any[]): Promise<T>;

  abstract createOne(...args: any[]): Promise<T>;

  abstract createMany(...args: any[]): Promise<T[]>;

  abstract updateOne(...args: any[]): Promise<T>;

  abstract deleteOne(...args: any[]): Promise<void | T>;

  throwBadRequestException(msg?: any): BadRequestException {
    throw new BadRequestException(msg);
  }

  throwNotFoundException(name: string): NotFoundException {
    throw new NotFoundException(`${name} not found`);
  }
}

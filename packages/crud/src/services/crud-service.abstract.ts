import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreateManyDto, CrudRequest, GetManyDefaultResponse } from '../interfaces';

export abstract class CrudService<T> {

  abstract getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]>;

  abstract getOne(req: CrudRequest): Promise<T>;

  abstract createOne(req: CrudRequest, dto: T): Promise<T>;

  abstract createMany(req: CrudRequest, dto: CreateManyDto): Promise<T[]>;

  abstract updateOne(req: CrudRequest, dto: T): Promise<T>;

  abstract replaceOne(req: CrudRequest, dto: T): Promise<T>;

  abstract deleteOne(req: CrudRequest): Promise<void | T>;

  throwBadRequestException(msg?: any): BadRequestException {
    throw new BadRequestException(msg);
  }

  throwNotFoundException(name: string): NotFoundException {
    throw new NotFoundException(`${name} not found`);
  }

  /**
   * Wrap page into page-info
   * override this method to create custom page-info response
   * @param data
   * @param total
   * @param limit
   * @param offset
   */
  public createPageInfo(
    data: T[],
    total: number,
    limit: number,
    offset: number,
  ): GetManyDefaultResponse<T> {
    return {
      data,
      count: data.length,
      total,
      page: Math.floor(offset / limit) + 1,
      pageCount:
        limit && total
          ? Math.ceil(total / limit)
          : /* istanbul ignore next line */
          undefined,
    };
  }
}

import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RestfulOptions, GetManyDefaultResponse } from '../interfaces';

export abstract class RestfulService<T> {
  protected abstract options: RestfulOptions;

  constructor() {}

  abstract getMany(...args: any[]): Promise<GetManyDefaultResponse<T>>;
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

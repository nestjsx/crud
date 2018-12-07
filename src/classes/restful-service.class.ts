import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RestfulOptions } from '../interfaces';

export abstract class RestfulService<T> {
  abstract options: RestfulOptions;

  constructor() {}

  abstract getMany(...args: any[]): Promise<T[]>;

  abstract getOne(...args: any[]): Promise<T>;

  throwBadRequestException(msg?: any): BadRequestException {
    throw new BadRequestException(msg);
  }

  throwNotFoundException(name?: string): NotFoundException {
    const msg = name ? `${name} not found` : `Not found`;
    throw new NotFoundException(msg);
  }
}

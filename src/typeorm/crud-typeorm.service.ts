import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CrudService } from '../crud-service.interface';

@Injectable()
export class CrudTypeOrmService<T> implements CrudService<T> {
  constructor(private readonly repository: Repository<T>) {}

  public async save(entity: T): Promise<T> {
    if (!entity || typeof entity !== 'object') {
      throw new BadRequestException();
    }

    try {
      // https://github.com/typeorm/typeorm/issues/1544 is a known bug
      // so need to use `entity as any` for now
      // TODO: track that issue
      return await this.repository.save(entity as any);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  public async create(entity: T): Promise<T> {
    return await this.save(entity);
  }

  public async getOne(id: number): Promise<T> {
    if (isNaN(id) || typeof id !== 'number') {
      throw new BadRequestException();
    }

    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  public async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  public async update(id: number, entity: T): Promise<T> {
    const exists = await this.getOne(id);

    return await this.save(entity);
  }

  public async delete(id: number): Promise<void> {
    if (isNaN(id) || typeof id !== 'number') {
      throw new BadRequestException();
    }

    try {
      await this.repository.delete(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }
}

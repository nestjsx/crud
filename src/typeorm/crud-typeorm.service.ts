import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CrudService } from '../crud-service.interface';

@Injectable()
export class CrudTypeOrmService<T> implements CrudService<T> {
  constructor(private readonly repository: Repository<T>) { }

  protected async save(entity: T): Promise<T> {
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

  protected getId(paramId: any): number {
    const id = parseInt(paramId, 10);

    if (isNaN(id) || typeof id !== 'number') {
      throw new BadRequestException();
    }

    return id;
  }

  public async create(entity: T): Promise<T> {
    return await this.save(entity);
  }

  public async getOne(paramId: any): Promise<T> {
    const id = this.getId(paramId);
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  public async getAll(): Promise<T[]> {
    return await this.repository.find();
  }

  public async update(paramId: any, entity: T): Promise<T> {
    const exists = await this.getOne(paramId);

    return await this.save(entity);
  }

  public async delete(paramId: any): Promise<void> {
    const id = this.getId(paramId);

    try {
      await this.repository.delete(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }
} /* istanbul ignore next */

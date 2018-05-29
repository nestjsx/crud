import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudTypeOrmService } from '../../src/typeorm/crud-typeorm.service';
import { MockEntity } from './mock-entity';

@Injectable()
export class MockService extends CrudTypeOrmService<MockEntity> {
  constructor(
    @InjectRepository(MockEntity) repository: Repository<MockEntity>,
  ) {
    super(repository);
  }
}

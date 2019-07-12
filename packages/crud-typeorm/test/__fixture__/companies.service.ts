import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from '../../../../integration/crud-typeorm/companies';
import { TypeOrmCrudService } from '../../src/typeorm-crud.service';

@Injectable()
export class CompaniesService extends TypeOrmCrudService<Company> {
  constructor(@InjectRepository(Company) repo) {
    super(repo);
  }
}

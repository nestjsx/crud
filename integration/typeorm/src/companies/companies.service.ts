import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryService } from '@nestjsx/crud/typeorm';
import { RestfulOptions } from '@nestjsx/crud';

import { Company } from './company.entity';

@Injectable()
export class CompaniesService extends RepositoryService<Company> {
  protected options: RestfulOptions = {};

  constructor(@InjectRepository(Company) repo) {
    super(repo);
  }
}

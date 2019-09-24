import { Inject, Injectable } from '@nestjs/common';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import Company from './company.model';

@Injectable()
export class CompaniesService extends SequelizeCrudService<Company> {
  constructor(
    @Inject('CompaniesRepository')
    private readonly companiesRepository: Company & typeof Company
  ) {
    super(companiesRepository);
  }
}

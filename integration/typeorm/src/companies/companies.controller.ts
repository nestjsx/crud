import { Controller, Param } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, ParsedQuery, ParsedOptions } from '@nestjsx/crud';

import { Company } from './company.entity';
import { CompaniesService } from './companies.service';

@Crud(Company, {
  params: {},
  routes: {},
  options: {
    join: {
      users: {
        exclude: ['password'],
      },
    },
    sort: [{ field: 'id', order: 'DESC' }],
    maxLimit: 5,
    cache: 3000,
  },
})
@ApiUseTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}

  get base(): CrudController<CompaniesService, Company> {
    return this;
  }

  @Override()
  async getOne(@ParsedQuery() query, @ParsedOptions() options) {
    return this.base.getOneBase(query, options);
  }
}

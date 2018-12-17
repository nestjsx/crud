import { Controller } from '@nestjs/common';
import { Crud, CrudController, RestfulOptions } from '@nestjsx/crud';

import { Company } from './company.entity';
import { CompaniesService } from './companies.service';

@Crud(Company)
@Controller('/companies')
export class CompaniesController implements CrudController<CompaniesService, Company> {
  paramsFilter = [];

  options: RestfulOptions = {
    join: {
      users: {},
    },
    sort: [{ field: 'id', order: 'DESC' }],
    maxLimit: 10,
    cache: 3000,
  };

  constructor(public service: CompaniesService) {}
}

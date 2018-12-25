import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { Company } from './company.entity';
import { CompaniesService } from './companies.service';

@Crud(Company, {
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
export class CompaniesController implements CrudController<CompaniesService, Company> {
  constructor(public service: CompaniesService) {}
}

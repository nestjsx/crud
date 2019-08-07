import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Company } from './company.model';
import { CompaniesService } from './companies.service';

@Crud({
  model: {
    type: Company,
  },
  query: {
    join: {
      users: {},
      projects: {},
    },
  },
})
@ApiUseTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}
}

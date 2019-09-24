import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { CompaniesService } from './companies.service';
import { Company } from './company.entity';

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

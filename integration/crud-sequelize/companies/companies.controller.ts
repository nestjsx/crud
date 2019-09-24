import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { CompaniesService } from './companies.service';
import { CompanyDto } from './company.dto';

@Crud({
  model: {
    type: CompanyDto,
  },
  query: {
    join: {
      users: {},
      projects: {},
    },
  },
  validation: false
})
@ApiUseTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}
}

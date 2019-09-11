import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Company } from './company.entity';
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
  customOperators: {
    customNe: (field: string, param: string) => `${field} != :${param}`
  }
})
@ApiUseTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}
}

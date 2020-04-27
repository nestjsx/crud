import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Company } from './company.entity';
import { CompaniesService } from './companies.service';
import { dto } from './dto';
import { serialize } from './response';

@Crud({
  model: {
    type: Company,
  },
  // dto,
  serialize,
  routes: {
    deleteOneBase: {
      returnDeleted: false,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      users: {},
      projects: {},
    },
  },
})
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}
}

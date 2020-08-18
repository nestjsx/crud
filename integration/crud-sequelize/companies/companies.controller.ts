import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { CompaniesService } from './companies.service';
import { dto } from './dto';
import { serialize } from './response';
import { Company } from './company.model';

@Crud({
  model: {
    type: Company,
  },
  dto,
  serialize,
  routes: {
    deleteOneBase: {
      returnDeleted: false,
    },
  },
  query: {
    alwaysPaginate: false,
    allow: ['name'],
    join: {
      users: {
        alias: 'companyUsers',
        exclude: ['email'],
        eager: true,
      },
      'users.projects': {
        eager: true,
        alias: 'usersProjects',
        allow: ['name'],
      },
      'users.projects.company': {
        eager: true,
        alias: 'usersProjectsCompany',
      },
      projects: {
        eager: true,
        select: false,
      },
    },
  },
})
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(public service: CompaniesService) {}
}

import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@rewiko/crud';

import { Company } from './company.entity';
import { CompaniesService } from './companies.service';
import { serialize } from './responses';

@Crud({
  model: {
    type: Company
  },
  serialize,
  routes: {
    deleteOneBase: {
      returnDeleted: false,
    },
  },
  query: {
    alwaysPaginate: false,
    softDelete: true,
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

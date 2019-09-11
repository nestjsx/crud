import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

@Crud({
  model: {
    type: Project,
  },
  params: {
    companyId: {
      field: 'companyId',
      type: 'number',
    },
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      users: {},
    },
  },
  customOperators: {
    custom: (field: string, param: string) => `${field} = :${param}`
  }
})
@ApiUseTags('projects')
@Controller('/companies/:companyId/projects')
export class ProjectsController {
  constructor(public service: ProjectsService) {}
}

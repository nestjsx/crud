import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { ProjectDto } from './project.dto';
import { ProjectsService } from './projects.service';

@Crud({
  model: {
    type: ProjectDto,
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
  validation: false
})
@ApiUseTags('projects')
@Controller('/companies/:companyId/projects')
export class ProjectsController {
  constructor(public service: ProjectsService) {}
}

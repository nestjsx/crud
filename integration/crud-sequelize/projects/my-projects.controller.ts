import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudAuth } from '@nestjsx/crud';

import { User } from '../users/user.model';
import { UserProjectsService } from './user-projects.service';
import { Project } from './project.model';

@Crud({
  model: {
    type: Project,
  },
  params: {
    projectId: {
      field: 'projectId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      project: {
        eager: true,
      },
    },
  },
})
@CrudAuth({
  filter: (user: User) => ({
    userId: user.id,
  }),
  persist: (user: User) => ({
    userId: user.id,
  }),
})
@ApiTags('my-projects')
@Controller('my-projects')
export class MyProjectsController {
  constructor(public service: UserProjectsService) {}
}

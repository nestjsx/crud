import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudAuth } from '@rewiko/crud';

import { User } from '../users/user.entity';
import { UserProject } from './user-project.entity';
import { UserProjectsService } from './user-projects.service';

@Crud({
  model: {
    type: UserProject,
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

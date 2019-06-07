import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
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
      company: {
        exclude: ['description'],
      },
      profile: {
        eager: true,
        exclude: ['updatedAt'],
      },
    },
  },
})
@ApiUseTags('users')
@Controller('/companies/:companyId/users')
export class UsersController {
  constructor(public service: UsersService) {}
}

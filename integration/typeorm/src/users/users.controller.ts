import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud(User, {
  routes: {
    exclude: ['createManyBase'],
    getManyBase: {
      interceptors: [],
    },
    updateOneBase: {
      allowParamsOverride: false,
    },
    deleteOneBase: {
      returnDeleted: true,
    },
  },
  // params: {
  //   companyId: 'number',
  //   id: 'number',
  // },
  options: {
    exclude: ['password'],
    join: {
      profile: {
        allow: ['firstName', 'lastName'],
      },
    },
    maxLimit: 10,
    cache: 3000,
  },
  validation: {
    validationError: {
      target: false,
      value: false,
    },
  },
})
@ApiUseTags('company users')
@Controller('/companies/:companyId/users')
export class UsersController {
  constructor(public service: UsersService) {}
}

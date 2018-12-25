import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController, RestfulOptions } from '@nestjsx/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud(User, {
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
  params: ['companyId'],
  validation: {
    validationError: {
      target: false,
      value: false,
    },
  },
})
@ApiUseTags('company users')
@Controller('/companies/:companyId/users')
export class UsersController implements CrudController<UsersService, User> {
  constructor(public service: UsersService) {}
}

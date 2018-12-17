import { Controller } from '@nestjs/common';
import { Crud, CrudController, RestfulOptions } from '@nestjsx/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud(User, {
  validation: {
    validationError: {
      target: false,
      value: false,
    },
  },
})
@Controller('/companies/:companyId/users')
export class UsersController implements CrudController<UsersService, User> {
  paramsFilter = ['companyId'];

  options: RestfulOptions = {
    exclude: ['password'],
    join: {
      profile: {
        allow: ['firstName', 'lastName'],
      },
    },
    maxLimit: 10,
    cache: 3000,
  };

  constructor(public service: UsersService) {}
}

import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController, RestfulOptions } from '@nestjsx/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud(User)
@Controller('')
export class UsersController {
  constructor(public service: UsersService) {}
}

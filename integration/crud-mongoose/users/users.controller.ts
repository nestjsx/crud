import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  serialize: {
    get: false,
    getMany: false,
    createMany: false,
    create: false,
    update: false,
    replace: false,
    delete: false
  }
})
@Controller('users')
export class UsersController implements CrudController<User> {

  constructor(public service: UsersService) {
  }
}

import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudAuth } from '@nestjsx/crud';

import { User } from './user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  routes: {
    only: ['getOneBase', 'updateOneBase'],
  },
  params: {
    id: {
      primary: true,
      disabled: true,
    },
  },
  query: {
    join: {
      company: {
        eager: true,
      },
      profile: {
        eager: true,
      },
    },
  },
})
@CrudAuth({
  filter: (user: User) => ({
    id: user.id,
  }),
})
@ApiUseTags('me')
@Controller('me')
export class MeController {
  constructor(public service: UsersService) {}
}

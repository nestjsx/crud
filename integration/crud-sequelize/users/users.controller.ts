import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';

import { UserDto } from './user.dto';
import User from './user.model';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: UserDto,
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
  validation: false
})
@ApiUseTags('users')
@Controller('/companies/:companyId/users')
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Override('getManyBase')
  getAll(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }
}

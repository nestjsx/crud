import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  ParsedRequest,
  Override,
} from '@rewiko/crud';

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
    softDelete: true,
    join: {
      company: {
        exclude: ['description'],
      },
      'company.projects': {
        alias: 'pr',
        exclude: ['description'],
      },
      profile: {
        eager: true,
        exclude: ['updatedAt'],
      },
    },
  },
})
@ApiTags('users')
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

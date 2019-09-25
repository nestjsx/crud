import { Inject, Injectable } from '@nestjs/common';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import User from './user.model';

@Injectable()
export class UsersService extends SequelizeCrudService<User> {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: User & typeof User
  ) {
    super(usersRepository);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../../../../integration/crud-sequelize/users/user.model';
import { SequelizeCrudService } from '../../src';

@Injectable()
export class UsersService extends SequelizeCrudService<User> {
  constructor(@InjectModel(User) user) {
    super(user);
  }
}

@Injectable()
export class UsersService2 extends SequelizeCrudService<User> {
  constructor(@InjectModel(User) repo) {
    super(repo);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeCrudService } from '@nestjsx/crud-sequelize';

import { User } from './user.model';

@Injectable()
export class UsersService extends SequelizeCrudService<User> {
  constructor(@InjectModel(User) private readonly user) {
    super(user);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RepositoryService } from './../../../../src/mongoose';
import { RestfulOptions } from '@nestjsx/crud';

import { User, UserScheme } from './user.entity';

@Injectable()
export class UsersService extends RepositoryService<User> {
  constructor(@InjectModel('User') repo) {
    super(repo, User);
  }
}

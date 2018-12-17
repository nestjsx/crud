import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryService } from '@nestjsx/crud/typeorm';
import { RestfulOptions } from '@nestjsx/crud';

import { User } from './user.entity';

@Injectable()
export class UsersService extends RepositoryService<User> {
  protected options: RestfulOptions = {};

  constructor(@InjectRepository(User) repo) {
    super(repo);
  }
}

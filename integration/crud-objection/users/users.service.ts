import { Inject, Injectable } from '@nestjs/common';

import { User } from './user.model';
import { ObjectionCrudService } from '@nestjsx/crud-objection';
import { ModelClass } from 'objection';

@Injectable()
export class UsersService extends ObjectionCrudService<User> {
  constructor(@Inject('User') modelClass: ModelClass<User>) {
    super(modelClass);
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { ObjectionCrudService } from '../../../crud-objection/src/objection-crud.service';
import { User } from '../../../../integration/crud-objection/users';
import { ModelClass } from 'objection';

@Injectable()
export class UsersService extends ObjectionCrudService<User> {
  constructor(@Inject('User') modelClass: ModelClass<User>) {
    super(modelClass);
  }
}
